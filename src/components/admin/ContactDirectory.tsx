"use client";

import ContactRow from "./ContactRow";

interface Contact {
  id: string;
  name: string;
  phone: string;
  title: string;
  email?: string;
}

interface ContactDirectoryProps {
  contacts: Contact[];
  onAddContact?: () => void;
}

export default function ContactDirectory({ contacts, onAddContact }: ContactDirectoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Contacts</h3>
        {onAddContact && (
          <button
            onClick={onAddContact}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add Contact
          </button>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <p>No contacts yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
          {contacts.map((contact) => (
            <ContactRow
              key={contact.id}
              name={contact.name}
              phone={contact.phone}
              title={contact.title}
              email={contact.email}
            />
          ))}
        </div>
      )}
    </div>
  );
}
