import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContactList } from '../components/ContactList';
import { SearchBar } from '../components/SearchBar';
import { ContactModal } from '../components/ContactModal';
import type { RootState, AppDispatch } from '../store/store';
import { fetchContacts, selectContact, toggleFavorite } from '../store/contactsSlice';
import { useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

export function ContactsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, loading, error, selectedContact } = useSelector((state: RootState) => state.contacts);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return contacts;

    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  const handleContactUpdate = async (contact: Contact) => {
    await dispatch(toggleFavorite(contact.id));
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
          <button onClick={() => dispatch(fetchContacts())}>
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
            onContactSelect={(contact: Contact) => {
              const latest = contacts.find((c: Contact) => c.id === contact.id);
              if (latest) {
                dispatch(selectContact({ ...latest }));
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
          onClose={() => dispatch(selectContact(null))}
          onUpdate={handleContactUpdate}
        />
      </main>
    </div>
  );
} 