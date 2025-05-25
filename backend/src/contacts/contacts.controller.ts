import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  NotFoundException, 
  HttpCode,
  HttpStatus,
  Query,
  Logger
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contact.interface';

@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllContacts(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<{ contacts: Contact[]; totalPages: number; currentPage: number }> {
    this.logger.log(`GET /contacts - Retrieving contacts (page: ${page}, limit: ${limit})`);
    try {
      const result = await this.contactsService.getPaginatedContacts(Number(page), Number(limit));
      this.logger.debug(`Retrieved ${result.contacts.length} contacts (page ${result.currentPage} of ${result.totalPages})`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve paginated contacts:`, error.message);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getContactById(@Param('id') id: string): Promise<Contact> {
    this.logger.log(`GET /contacts/${id} - Retrieving contact by ID`);
    try {
      const contact = await this.contactsService.getContactById(id);
      if (!contact) {
        this.logger.warn(`Contact with ID ${id} not found`);
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      this.logger.debug(`Successfully retrieved contact with ID: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(`Failed to retrieve contact with ID ${id}:`, error.message);
      throw error;
    }
  }

  @Patch(':id/favorite')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(@Param('id') id: string): Promise<Contact> {
    this.logger.log(`PATCH /contacts/${id}/favorite - Toggling favorite status`);
    try {
      const contact = await this.contactsService.toggleFavorite(id);
      if (!contact) {
        this.logger.warn(`Contact with ID ${id} not found`);
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      this.logger.debug(`Successfully toggled favorite status for contact ID: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(`Failed to toggle favorite status for contact ID ${id}:`, error.message);
      throw error;
    }
  }
} 