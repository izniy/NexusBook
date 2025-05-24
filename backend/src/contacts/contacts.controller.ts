import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  NotFoundException, 
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllContacts(): Promise<Contact[]> {
    this.logger.log('GET /contacts - Retrieving all contacts');
    const contacts = await this.contactsService.getAllContacts();
    this.logger.debug(`Retrieved ${contacts.length} contacts`);
    return contacts;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getContactById(@Param('id') id: string): Promise<Contact> {
    this.logger.log(`GET /contacts/${id} - Retrieving contact by ID`);
    try {
      const contact = await this.contactsService.getContactById(id);
      this.logger.debug(`Successfully retrieved contact with ID: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(`Failed to retrieve contact with ID ${id}:`, error.message);
      throw error; // Let NestJS handle the error response
    }
  }

  @Patch(':id/favorite')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(@Param('id') id: string): Promise<Contact> {
    this.logger.log(`PATCH /contacts/${id}/favorite - Toggling favorite status`);
    try {
      const contact = await this.contactsService.toggleFavorite(id);
      this.logger.debug(`Successfully toggled favorite status for contact ID: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(`Failed to toggle favorite status for contact ID ${id}:`, error.message);
      throw error; // Let NestJS handle the error response
    }
  }
} 