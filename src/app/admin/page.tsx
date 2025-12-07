"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Resident, Announcement } from "@/utils/supabase/types";
import Button from "@/components/Button";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Bell, Key, Users, Settings, Trash2, Plus, Search, Moon, User as UserIcon, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Toggle from "@/components/settings/Toggle";

export default function AdminPanel() {
  const supabase = createClient();
  const { user, darkMode, setDarkMode } = useUser();

  const [residents, setResidents] = useState<Resident[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [todayCode, setTodayCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"residents" | "announcements" | "gate-code" | "settings">("residents");

  // Resident form states
  const [showAddResident, setShowAddResident] = useState(false);
  const [newResident, setNewResident] = useState({ phone: "", full_name: "", house_number: "" });
  
  // Search and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const RESIDENTS_PER_PAGE = 10;

  // Form states
  const [annTitle, setAnnTitle] = useState("");
  const [annMsg, setAnnMsg] = useState("");

  const loadData = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);

    const [res, ann, codeRes] = await Promise.all([
      supabase.from("residents").select("*").order("full_name", { ascending: true }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase
        .from("gate_passes")
        .select("code")
        .eq("date", today)
        .maybeSingle(),
    ]);

    setResidents(res.data ?? []);
    setAnnouncements(ann.data ?? []);
    setTodayCode(codeRes.data?.code ?? "");
    setCurrentPage(1);
  }, [supabase]);

  // Load once on mount
  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [loadData]);

  const generateCode = async () => {
    setLoading(true);
    const res = await fetch("/api/cron/daily-code");
    if (res.ok) {
      const data = await res.json();
      setTodayCode(data.code);
    } else {
      alert("Failed to generate code");
    }
    setLoading(false);
    loadData(); // refresh UI
  };

  const addResident = async () => {
    if (!newResident.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    const cleanPhone = newResident.phone.replace(/\D/g, "");
    const finalPhone = cleanPhone.startsWith("0") ? cleanPhone : "0" + cleanPhone.replace(/^234|\+234/, "");

    const { error } = await supabase.from("residents").insert({
      phone: finalPhone,
      full_name: newResident.full_name || "Resident",
      house_number: newResident.house_number,
      is_admin: false,
    });

    if (error) {
      alert("Error adding resident: " + error.message);
    } else {
      setNewResident({ phone: "", full_name: "", house_number: "" });
      setShowAddResident(false);
      loadData();
    }
  };

  const toggleAdmin = async (id: string, current: boolean) => {
    await supabase.from("residents").update({ is_admin: !current }).eq("id", id);
    loadData();
  };

  const deleteResident = async (id: string) => {
    await supabase.from("residents").delete().eq("id", id);
    loadData();
  };

  const filteredResidents = residents.filter((r) =>
    (r.full_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedResidents = filteredResidents.slice(
    (currentPage - 1) * RESIDENTS_PER_PAGE,
    currentPage * RESIDENTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredResidents.length / RESIDENTS_PER_PAGE);

  const postAnnouncement = async () => {
    if (!annTitle.trim() || !annMsg.trim()) return;
    await supabase.from("announcements").insert({
      title: annTitle.trim(),
      message: annMsg.trim(),
      is_important: false,
    });
    setAnnTitle("");
    setAnnMsg("");
    loadData();
  };

  return (
    <>
      <AdminTopBar />
      <div className="min-h-screen bg-white dark:bg-neutral-900 pb-12">
        <div className="container max-w-7xl px-4 pt-6 pb-8">
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> */}
          <div className="">
            {/* nav buttons */}
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              {[
                { id: "residents", label: "Residents", icon: Users },
                { id: "announcements", label: "Announcements", icon: Bell },
                { id: "gate-code", label: "Gate Code", icon: Key },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "residents" | "announcements" | "gate-code" | "settings")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {/* Tab Content */}
              {activeTab === "residents" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      Manage Residents
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      View, update, or remove estate residents.
                    </p>
                  </div>

                  {/* Add Resident Button */}
                  <button
                    onClick={() => setShowAddResident(!showAddResident)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                  >
                    <Plus size={20} />
                    Add Resident
                  </button>

                  {/* Add Resident Form */}
                  {showAddResident && (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 space-y-3">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Add New Resident</h3>
                      <input
                        type="tel"
                        placeholder="Phone number (required)"
                        value={newResident.phone}
                        onChange={(e) => setNewResident({ ...newResident, phone: e.target.value })}
                        className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      />
                      <input
                        type="text"
                        placeholder="Full name (optional)"
                        value={newResident.full_name}
                        onChange={(e) => setNewResident({ ...newResident, full_name: e.target.value })}
                        className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      />
                      <input
                        type="text"
                        placeholder="House number (optional)"
                        value={newResident.house_number}
                        onChange={(e) => setNewResident({ ...newResident, house_number: e.target.value })}
                        className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={addResident}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                        >
                          Save Resident
                        </Button>
                        <Button
                          onClick={() => setShowAddResident(false)}
                          className="flex-1 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-neutral-900 dark:text-white py-2 rounded-lg font-semibold"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 pl-12 pr-4 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                    />
                  </div>

                  {/* Residents Table */}
                  <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full">
                      <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">Phone</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-white">House</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-neutral-900 dark:text-white">Admin</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-neutral-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedResidents.map((r) => (
                          <tr key={r.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition">
                            <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium">{r.phone}</td>
                            <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{r.full_name}</td>
                            <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{r.house_number}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => toggleAdmin(r.id, r.is_admin)}
                                className={`relative w-10 h-6 rounded-full transition-colors ${
                                  r.is_admin ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-600"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    r.is_admin ? "translate-x-5" : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => deleteResident(r.id)}
                                className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredResidents.length === 0 && (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">No residents found</p>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Page {currentPage} of {totalPages} • {filteredResidents.length} results
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "announcements" && (
                <div className="space-y-6">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Post Announcement</h2>
                    <div className="space-y-3 mb-4">
                      <input
                        placeholder="Title"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      />
                      <textarea
                        placeholder="Message..."
                        value={annMsg}
                        onChange={(e) => setAnnMsg(e.target.value)}
                        rows={4}
                        className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
                      />
                    </div>
                    <Button
                      onClick={postAnnouncement}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                    >
                      Publish Announcement
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Announcements</h3>
                    {announcements.length === 0 ? (
                      <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">No announcements yet</p>
                    ) : (
                      <div className="space-y-3">
                        {announcements.slice(0, 10).map((a) => (
                          <div key={a.id} className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                            <p className="font-bold text-neutral-900 dark:text-white">{a.title}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{a.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "gate-code" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-xl p-8 text-center text-white">
                    <p className="text-sm text-blue-100 mb-2">Today&apos;s Gate Code</p>
                    <div className="text-6xl font-bold tracking-widest mb-6">
                      {todayCode || "— — — —"}
                    </div>
                    <Button
                      onClick={generateCode}
                      disabled={loading}
                      className="w-full bg-white text-blue-600 hover:bg-neutral-100 font-semibold py-3 rounded-lg transition"
                    >
                      {loading ? "Generating..." : todayCode ? "Generate New Code" : "Generate Today's Code"}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      Admin Settings
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      Manage admin preferences and security.
                    </p>
                  </div>

                  {/* Admin Profile Card */}
                  <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                        {user?.full_name || "Admin"}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user?.phone || "Not available"}
                        </p>
                        {user?.house_number && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            House {user.house_number}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
                      Preferences
                    </h3>
                    
                    {/* Dark Mode */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Moon size={20} className="text-neutral-700 dark:text-neutral-300 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-neutral-900 dark:text-white">
                            Dark Mode
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Toggle between light and dark themes.
                          </p>
                        </div>
                      </div>
                      <Toggle
                        checked={darkMode}
                        onChange={setDarkMode}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}