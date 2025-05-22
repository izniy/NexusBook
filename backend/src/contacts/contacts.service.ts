import { Injectable } from '@nestjs/common';

interface Contact {
  name: string;
  email: string;
}

@Injectable()
export class ContactsService {
  getAllContacts(): Contact[] {
    return [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
    ];
  }
} 