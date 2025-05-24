import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

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
  private favoriteStatus = new Map<string, boolean>();
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly configService: ConfigService) {}

  async getAllContacts(): Promise<Contact[]> {
    // Only fetch from API if contacts array is empty
    if (this.contacts.length === 0) {
      const baseUrl = this.configService.get<string>('RANDOM_USER_API');
      if (!baseUrl) {
        this.logger.error('RANDOM_USER_API environment variable is not defined');
        throw new HttpException(
          'Internal server configuration error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      try {
        this.logger.log('Fetching contacts from RandomUser API...');
        const response = await axios.get<RandomUserResponse>(`${baseUrl}?results=50`);
        
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

    return this.contacts.map(contact => ({
      ...contact,
      isFavorite: this.favoriteStatus.get(contact.id) || false
    }));
  }

  async getContactById(id: string): Promise<Contact> {
    this.logger.debug(`Attempting to find contact with ID: ${id}`);
    
    // Ensure contacts are loaded
    await this.getAllContacts();
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      this.logger.warn(`Contact with ID ${id} not found`);
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return {
      ...contact,
      isFavorite: this.favoriteStatus.get(id) || false
    };
  }

  async toggleFavorite(id: string): Promise<Contact> {
    this.logger.debug(`Attempting to toggle favorite status for contact ID: ${id}`);
    
    // Ensure contacts are loaded
    await this.getAllContacts();
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      this.logger.warn(`Contact with ID ${id} not found when trying to toggle favorite status`);
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const currentStatus = this.favoriteStatus.get(id) || false;
    this.favoriteStatus.set(id, !currentStatus);
    
    this.logger.debug(
      `Successfully toggled favorite status for contact ID ${id} from ${currentStatus} to ${!currentStatus}`
    );

    return {
      ...contact,
      isFavorite: !currentStatus
    };
  }
} 