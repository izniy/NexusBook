import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts(): Promise<Contact[]> {
    return this.contactsService.getAllContacts();
  }
} 