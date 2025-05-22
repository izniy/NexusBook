import { Injectable } from '@nestjs/common';
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
  constructor(private readonly configService: ConfigService) {}

  async getAllContacts(): Promise<Contact[]> {
    const baseUrl = this.configService.get<string>('RANDOM_USER_API');
    if (!baseUrl) {
      throw new Error('RANDOM_USER_API environment variable is not defined');
    }

    try {
      const response = await axios.get<RandomUserResponse>(`${baseUrl}?results=50`);
      
      return response.data.results.map(user => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        phone: user.phone,
        picture: user.picture.large,
        isFavorite: false
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts from RandomUser API');
    }
  }
} 