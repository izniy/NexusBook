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

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
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

  useEffect(() => {
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

  // Update contact in the contacts array after favorite toggle
  const handleContactUpdate = async (updatedContact: Contact) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
    // Also update selected contact if it's the one being modified
    if (selectedContact?.id === updatedContact.id) {
      setSelectedContact(updatedContact);
    }
  };

  if (loading) {
    return (
      <div className="wrapper">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-5xl mb-4">⌛</div>
          <h2>Loading your contacts...</h2>
          <p className="text-gray-500">Just a moment while we fetch everything.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <div className="error-block min-h-[60vh]">
          <div className="text-5xl mb-4">😢</div>
          <h2>Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button onClick={fetchContacts}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="wrapper">
          <h1>NexusBook</h1>
          <div className="max-w-3xl mx-auto mt-6">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </header>
      <main className="wrapper">
        <div className="contacts-grid">
          <ContactList 
            contacts={filteredContacts}
            onContactSelect={(contact) => {
              const latest = contacts.find(c => c.id === contact.id);
              if (latest) {
                setSelectedContact({ ...latest });
              }
            }}
          />
        </div>
        {filteredContacts.length === 0 && searchQuery && (
          <div className="error-block">
            <div className="text-4xl mb-4">🔍</div>
            <h2>No Results Found</h2>
            <p>No contacts found matching "{searchQuery}"</p>
          </div>
        )}
        <ContactModal
          contact={selectedContact}
          isOpen={selectedContact !== null}
          onClose={() => setSelectedContact(null)}
          onUpdate={handleContactUpdate}
        />
      </main>
    </div>
  );
} 