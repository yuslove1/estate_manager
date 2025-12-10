"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/context/UserContext";
import { Phone, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  title?: string;
}

export default function EmergencyContactsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUser();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", title: "" });
  const [isAdding, setIsAdding] = useState(false);

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading contacts:", error);
        return;
      }

      setContacts(data || []);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleAddContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    if (!user?.is_admin) {
      toast.error("Only admins can add contacts");
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .insert({
          name: newContact.name.trim(),
          phone: newContact.phone.trim(),
          title: newContact.title.trim() || null,
        });

      if (error) {
        console.error("Error adding contact:", error);
        toast.error("Failed to add contact");
        return;
      }

      toast.success("Contact added");
      setNewContact({ name: "", phone: "", title: "" });
      setShowAddForm(false);
      await loadContacts();
    } catch (err) {
      console.error("Failed to add contact:", err);
      toast.error("Failed to add contact");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!user?.is_admin) {
      toast.error("Only admins can delete contacts");
      return;
    }

    if (!confirm("Delete this contact?")) return;

    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
        return;
      }

      toast.success("Contact deleted");
      await loadContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);
      toast.error("Failed to delete contact");
    }
  };

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container max-w-2xl mx-auto px-4 pt-6 pb-24 backdrop-blur-sm min-h-screen" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Phone size={24} className="text-red-600" />
              Emergency Contacts
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Estate emergency contact directory
            </p>
          </div>
        </div>

        {/* Add Contact Button (Admin Only) */}
        {user?.is_admin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition mb-6"
          >
            <Plus size={20} />
            Add Contact
          </button>
        )}

        {/* Add Contact Form */}
        {showAddForm && user?.is_admin && (
          <div className="rounded-xl p-6 space-y-4 mb-6 backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Add New Contact</h3>
            <input
              type="text"
              placeholder="Contact name (e.g., Police Station)"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500"
            />
            <input
              type="tel"
              placeholder="Phone number (e.g., 08012345678)"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="Title/Role (optional, e.g., Emergency Line)"
              value={newContact.title}
              onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddContact}
                disabled={isAdding}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
              >
                {isAdding ? "Adding..." : "Add Contact"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-xl p-12 text-center backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
            <Phone size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 text-lg">No emergency contacts yet</p>
            {user?.is_admin && (
              <p className="text-sm text-neutral-500 mt-2">Add the first contact using the button above</p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden backdrop-blur-md" style={{ background: "rgba(255, 255, 255, 0.9)", borderColor: "rgba(229, 231, 235, 0.8)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">Title</th>
                    {user?.is_admin && (
                      <th className="px-6 py-4 text-center text-sm font-bold text-neutral-900 dark:text-white">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-white">{contact.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <a href={`tel:${contact.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {contact.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{contact.title || "—"}</td>
                      {user?.is_admin && (
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
