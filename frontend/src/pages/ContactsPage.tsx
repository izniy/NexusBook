import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ContactList } from '../components/ContactList';
import { SearchBar } from '../components/SearchBar';
import { ContactModal } from '../components/ContactModal';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>('http://localhost:3000/contacts');
        setContacts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contacts. Please try again later.');
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return contacts;

    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">NexusBook</h1>
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </header>
      <main className="w-full px-4 py-6">
        <ContactList 
          contacts={filteredContacts} 
          onContactSelect={setSelectedContact}
        />
        {filteredContacts.length === 0 && searchQuery && (
          <div className="text-center text-gray-500 mt-8">
            No contacts found matching "{searchQuery}"
          </div>
        )}
        <ContactModal
          contact={selectedContact}
          isOpen={selectedContact !== null}
          onClose={() => setSelectedContact(null)}
        />
      </main>
    </div>
  );
} 