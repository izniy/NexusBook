import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { Contact } from './contact.interface';

interface RandomUserResponse {
  results: {
    login: { uuid: string };
    name: { first: string; last: string };
    email: string;
    phone: string;
    picture: { large: string };
  }[];
}

@Injectable()
export class ContactsService {
  private contacts: Contact[] = [];
  private favoriteStatus: Map<string, boolean> = new Map();
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly configService: ConfigService) {
    this.loadContacts();
  }

  private async loadContacts() {
    try {
      const baseUrl = this.configService.get<string>('RANDOM_USER_API');
      if (!baseUrl) {
        this.logger.error('RANDOM_USER_API environment variable is not defined');
        throw new HttpException(
          'Internal server configuration error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      this.logger.log('Fetching contacts from RandomUser API...');
      const response = await axios.get<RandomUserResponse>(`${baseUrl}?results=100`);
      
      this.contacts = response.data.results.map(user => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        phone: user.phone,
        picture: user.picture.large,
        isFavorite: this.favoriteStatus.get(user.login.uuid) || false
      }));
      
      this.logger.log(`Successfully fetched ${this.contacts.length} contacts`);
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to fetch contacts: ${axiosError.message}`,
        axiosError.stack
      );
      throw new HttpException(
        'Failed to fetch contacts from external service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllContacts(): Promise<Contact[]> {
    this.logger.debug('Getting all contacts');
    if (this.contacts.length === 0) {
      this.logger.debug('Contacts cache empty, loading from API');
      await this.loadContacts();
    }
    const contacts = this.contacts.map(contact => ({
      ...contact,
      isFavorite: this.favoriteStatus.get(contact.id) || false
    }));
    this.logger.debug(`Returning ${contacts.length} contacts`);
    return contacts;
  }

  async getPaginatedContacts(page = 1, limit = 10): Promise<{ contacts: Contact[]; totalPages: number; currentPage: number }> {
    this.logger.debug(`Getting paginated contacts (page: ${page}, limit: ${limit})`);
    
    if (this.contacts.length === 0) {
      this.logger.debug('Contacts cache empty, loading from API');
      await this.loadContacts();
    }

    const total = this.contacts.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    this.logger.debug(`Calculating pagination: total=${total}, totalPages=${totalPages}, currentPage=${currentPage}`);
    this.logger.debug(`Slice range: startIndex=${startIndex}, endIndex=${endIndex}`);

    const paginatedContacts = this.contacts.slice(startIndex, endIndex).map(contact => ({
      ...contact,
      isFavorite: this.favoriteStatus.get(contact.id) || false
    }));

    this.logger.debug(`Returning ${paginatedContacts.length} contacts for page ${currentPage}`);
    return {
      contacts: paginatedContacts,
      totalPages,
      currentPage,
    };
  }

  async getContactById(id: string): Promise<Contact> {
    this.logger.debug(`Attempting to find contact with ID: ${id}`);
    
    // Ensure contacts are loaded
    if (this.contacts.length === 0) {
      this.logger.debug('Contacts cache empty, loading from API');
      await this.loadContacts();
    }
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      this.logger.warn(`Contact with ID ${id} not found`);
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    this.logger.debug(`Found contact: ${contact.name} (${contact.id})`);
    return {
      ...contact,
      isFavorite: this.favoriteStatus.get(id) || false
    };
  }

  async toggleFavorite(id: string): Promise<Contact> {
    this.logger.debug(`Attempting to toggle favorite status for contact ID: ${id}`);
    
    // Ensure contacts are loaded
    if (this.contacts.length === 0) {
      this.logger.debug('Contacts cache empty, loading from API');
      await this.loadContacts();
    }
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      this.logger.warn(`Contact with ID ${id} not found when trying to toggle favorite status`);
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const currentStatus = this.favoriteStatus.get(id) || false;
    this.favoriteStatus.set(id, !currentStatus);
    
    this.logger.debug(
      `Successfully toggled favorite status for contact ${contact.name} (${id}) from ${currentStatus} to ${!currentStatus}`
    );

    return {
      ...contact,
      isFavorite: !currentStatus
    };
  }
} 