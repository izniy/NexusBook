import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getContacts, toggleFavorite as toggleFavoriteApi } from '../services/api';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface FetchContactsParams {
  page?: number;
  limit?: number;
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  limit: 20
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async ({ page = 1, limit = 20 }: FetchContactsParams = {}) => {
    const response = await getContacts(page, limit);
    return response;
  }
);

export const toggleFavorite = createAsyncThunk(
  'contacts/toggleFavorite',
  async (id: string) => {
    const response = await toggleFavoriteApi(id);
    return response;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state: ContactsState, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    updateContact: (state: ContactsState, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex((c: Contact) => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      if (state.selectedContact?.id === action.payload.id) {
        state.selectedContact = action.payload;
      }
    },
    setCurrentPage: (state: ContactsState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state: ContactsState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state: ContactsState, action: PayloadAction<{ contacts: Contact[]; totalPages: number; currentPage: number }>) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchContacts.rejected, (state: ContactsState) => {
        state.loading = false;
        state.error = 'Failed to fetch contacts. Please try again later.';
      })
      .addCase(toggleFavorite.fulfilled, (state: ContactsState, action: PayloadAction<Contact>) => {
        const index = state.contacts.findIndex((c: Contact) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      });
  },
});

export const { selectContact, updateContact, setCurrentPage } = contactsSlice.actions;
export default contactsSlice.reducer; 