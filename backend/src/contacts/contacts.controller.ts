import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contacts.service';

interface Contact {
  name: string;
  email: string;
}

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getAllContacts(): Contact[] {
    return this.contactsService.getAllContacts();
  }
} 