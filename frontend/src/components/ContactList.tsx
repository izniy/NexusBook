import { ContactCard } from './ContactCard';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  isFavorite: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

export function ContactList({ contacts, onContactSelect }: ContactListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-6 py-8">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => onContactSelect(contact)}
        >
          <div className="relative">
            <img
              src={contact.picture}
              alt={contact.name}
              className="w-full h-48 object-cover"
            />
            {contact.isFavorite && (
              <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.name}</h3>
            <p className="text-gray-600 text-sm mb-1">{contact.email}</p>
            <p className="text-gray-600 text-sm">{contact.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}