import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContactList } from '../components/ContactList';
import { SearchBar } from '../components/SearchBar';
import { ContactModal } from '../components/ContactModal';
import type { RootState, AppDispatch } from '../store/store';
import { fetchContacts, selectContact, toggleFavorite, setCurrentPage } from '../store/contactsSlice';
import { useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

type SortOption = 'nameAsc' | 'nameDesc' | 'emailAsc' | 'emailDesc';

export function ContactsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, loading, error, selectedContact, currentPage, totalPages, limit } = useSelector((state: RootState) => state.contacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('nameAsc');

  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // First, filter contacts
    const filtered = query 
      ? contacts.filter(contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query)
        )
      : contacts;

    // Then, sort the filtered results
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'emailAsc':
          return a.email.localeCompare(b.email);
        case 'emailDesc':
          return b.email.localeCompare(a.email);
        default:
          return 0;
      }
    });
  }, [contacts, searchQuery, sortBy]);

  const handleContactUpdate = async (contact: Contact) => {
    await dispatch(toggleFavorite(contact.id));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const renderSortDropdown = () => (
    <div className="mb-6">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="block w-full md:w-48 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Sort contacts"
      >
        <option value="nameAsc">Name (A–Z)</option>
        <option value="nameDesc">Name (Z–A)</option>
        <option value="emailAsc">Email (A–Z)</option>
        <option value="emailDesc">Email (Z–A)</option>
      </select>
    </div>
  );

  const renderPaginationControls = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
    );
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
          <button onClick={() => dispatch(fetchContacts({ page: currentPage, limit }))}>
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
        {renderSortDropdown()}
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
        {filteredContacts.length > 0 && renderPaginationControls()}
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