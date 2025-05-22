import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

  constructor(private readonly configService: ConfigService) {}

  async getAllContacts(): Promise<Contact[]> {
    // Only fetch from API if contacts array is empty
    if (this.contacts.length === 0) {
      const baseUrl = this.configService.get<string>('RANDOM_USER_API');
      if (!baseUrl) {
        throw new Error('RANDOM_USER_API environment variable is not defined');
      }

      try {
        const response = await axios.get<RandomUserResponse>(`${baseUrl}?results=50`);
        
        this.contacts = response.data.results.map(user => ({
          id: user.login.uuid,
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
          picture: user.picture.large,
          isFavorite: this.favoriteStatus.get(user.login.uuid) || false
        }));
      } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Failed to fetch contacts from RandomUser API');
      }
    }

    // Return contacts with current favorite status
    return this.contacts.map(contact => ({
      ...contact,
      isFavorite: this.favoriteStatus.get(contact.id) || false
    }));
  }

  async getContactById(id: string): Promise<Contact> {
    // Ensure contacts are loaded
    await this.getAllContacts();
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return {
      ...contact,
      isFavorite: this.favoriteStatus.get(id) || false
    };
  }

  async toggleFavorite(id: string): Promise<Contact> {
    // Ensure contacts are loaded
    await this.getAllContacts();
    
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const currentStatus = this.favoriteStatus.get(id) || false;
    this.favoriteStatus.set(id, !currentStatus);

    return {
      ...contact,
      isFavorite: !currentStatus
    };
  }
} 