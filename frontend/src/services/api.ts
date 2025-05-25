import axios from 'axios';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

const BASE_URL = 'http://localhost:3000';

export const getContacts = async (): Promise<Contact[]> => {
  const response = await axios.get<Contact[]>(`${BASE_URL}/contacts`);
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