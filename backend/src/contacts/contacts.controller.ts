import { Controller, Get, Param, Patch, NotFoundException, HttpCode } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts(): Promise<Contact[]> {
    return this.contactsService.getAllContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.getContactById(id);
  }

  @Patch(':id/favorite')
  @HttpCode(200)
  async toggleFavorite(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.toggleFavorite(id);
  }
} 