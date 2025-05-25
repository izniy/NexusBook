import axios from 'axios';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

interface PaginatedResponse {
  contacts: Contact[];
  totalPages: number;
  currentPage: number;
}

const BASE_URL = 'http://localhost:3000';

export const getContacts = async (page = 1, limit = 20): Promise<PaginatedResponse> => {
  const response = await axios.get<PaginatedResponse>(`${BASE_URL}/contacts`, {
    params: { page, limit }
  });
  return response.data;
};

export const getContactById = async (id: string): Promise<Contact> => {
  const response = await axios.get<Contact>(`${BASE_URL}/contacts/${id}`);
  return response.data;
};

export const toggleFavorite = async (id: string): Promise<Contact> => {
  const response = await axios.patch<Contact>(`${BASE_URL}/contacts/${id}/favorite`);
  return response.data;
}; 