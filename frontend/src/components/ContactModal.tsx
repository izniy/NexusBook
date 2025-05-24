import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

interface ContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (contact: Contact) => void;
}

export function ContactModal({ contact, isOpen, onClose, onUpdate }: ContactModalProps) {
  const [localFavorite, setLocalFavorite] = useState(false);

  useEffect(() => {
    if (contact) {
      setLocalFavorite(contact.isFavorite);
    }
  }, [contact]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleCall = () => {
    alert(`Calling ${contact?.name}...`);
  };

  const toggleFavorite = async () => {
    if (!contact) return;

    // Optimistically update UI
    const newFavoriteStatus = !localFavorite;
    setLocalFavorite(newFavoriteStatus);

    try {
      const response = await axios.patch<Contact>(
        `http://localhost:3000/contacts/${contact.id}/favorite`,
        { isFavorite: newFavoriteStatus }
      );
      
      // Update parent component with new contact data
      onUpdate({
        ...contact,
        isFavorite: newFavoriteStatus
      });
    } catch (error) {
      // Revert on error
      setLocalFavorite(localFavorite);
      console.error('Failed to update favorite status:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Cleanup: remove event listener and restore scrolling
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen || !contact) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close and favorite buttons */}
        <div className="relative">
          <img 
            src={contact.picture} 
            alt={contact.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                localFavorite 
                  ? 'bg-yellow-400 text-white' 
                  : 'bg-black bg-opacity-50 text-white hover:bg-opacity-75'
              }`}
              aria-label={localFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 20 20" 
                fill={localFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={localFavorite ? 0 : 2}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
              aria-label="Close modal"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contact details */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{contact.name}</h2>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              <a 
                href={`mailto:${contact.email}`} 
                className="hover:text-blue-600 transition-colors"
              >
                {contact.email}
              </a>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              <a 
                href={`tel:${contact.phone}`}
                className="hover:text-blue-600 transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={handleCall}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <span className="mr-2">📞</span>
            Call
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 