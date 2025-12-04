"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminPanel() {
  const supabase = createClient();

  interface Resident {
    id: string;
    phone: string;
    full_name: string;
    house_number: string;
    is_admin: boolean;
  }

  const [residents, setResidents] = useState<Resident[]>([]);
  interface Announcement {
    id: string;
    title: string;
    message: string;
    is_important: boolean;
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [todayCode, setTodayCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);

  // Form states
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [house, setHouse] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annMsg, setAnnMsg] = useState("");

  const loadData = async () => {
    const [res, ann, code] = await Promise.all([
      supabase.from("residents").select("*").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("gate_passes").select("code").eq("date", new Date().toISOString().slice(0, 10)).single()
    ]);

    setResidents(res.data || []);
    setAnnouncements(ann.data || []);
    setTodayCode(code.data?.code || "");
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const generateCode = async () => {
    setLoadingCode(true);
    const res = await fetch("/api/cron/daily-code");
    if (res.ok) {
      const data = await res.json();
      setTodayCode(data.code);
      alert(`New code generated: ${data.code}`);
    } else {
      alert("Failed to generate code");
    }
    setLoadingCode(false);
  };

  const addResident = async () => {
    if (!phone) return;
    const clean = phone.replace(/\D/g, "");
    const finalPhone = clean.startsWith("0") ? clean : clean.startsWith("234") ? "0" + clean.slice(3) : "0" + clean;
    await supabase.from("residents").insert({
      phone: finalPhone,
      full_name: name || "Resident",
      house_number: house,
      is_admin: false
    });
    setPhone(""); setName(""); setHouse("");
    loadData();
  };

  const toggleAdmin = async (id: string, current: boolean) => {
    await supabase.from("residents").update({ is_admin: !current }).eq("id", id);
    loadData();
  };

  const deleteResident = async (id: string) => {
    await supabase.from("residents").delete().eq("id", id);
    loadData();
  };

  const postAnnouncement = async () => {
    if (!annTitle.trim() || !annMsg.trim()) return;
    await supabase.from("announcements").insert({
      title: annTitle.trim(),
      message: annMsg.trim(),
      is_important: false
    });
    setAnnTitle(""); setAnnMsg("");
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Brentfield Admin
          </h1>
          <button
            onClick={() => {
              document.cookie = "verified_phone=; path=/; expires=Thu, 01 Jan 1970";
              window.location.href = "/";
            }}
            className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold transition"
          >
            Logout
          </button>
        </div>

        {/* Today's Code - Hero Section */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-lg border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center mb-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 opacity-90">Today&apos;s Gate Pass Code</h2>
          <div className="text-8xl md:text-9xl font-bold tracking-widest mb-8 text-emerald-400">
            {todayCode || "— — — —"}
          </div>
          <button
            onClick={generateCode}
            disabled={loadingCode}
            className="bg-white text-emerald-900 hover:bg-gray-100 disabled:opacity-50 px-10 py-5 rounded-2xl font-bold text-xl shadow-lg transition transform hover:scale-105"
          >
            {loadingCode ? "Generating..." : todayCode ? "Generate New Code" : "Generate Today's Code"}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Residents Panel */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Residents ({residents.length})</h2>
            
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="bg-slate-800 p-4 rounded-xl" />
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-800 p-4 rounded-xl" />
              <input placeholder="House" value={house} onChange={e => setHouse(e.target.value)} className="bg-slate-800 p-4 rounded-xl" />
            </div>
            <button onClick={addResident} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold mb-6">
              Add Resident
            </button>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {residents.map(r => (
                <div key={r.id} className="bg-slate-800/70 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{r.full_name || "No name"} — {r.house_number}</p>
                    <p className="text-sm opacity-70">{r.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdmin(r.id, r.is_admin)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold ${r.is_admin ? "bg-yellow-600" : "bg-slate-600"}`}
                    >
                      {r.is_admin ? "ADMIN" : "Make Admin"}
                    </button>
                    <button onClick={() => deleteResident(r.id)} className="text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Panel */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Announcements</h2>
            
            <input
              placeholder="Title"
              value={annTitle}
              onChange={e => setAnnTitle(e.target.value)}
              className="w-full bg-slate-800 p-4 rounded-xl mb-3"
            />
            <textarea
              placeholder="Message..."
              value={annMsg}
              onChange={e => setAnnMsg(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 p-4 rounded-xl mb-4 resize-none"
            />
            <button onClick={postAnnouncement} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold mb-6">
              Post Announcement
            </button>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {announcements.length === 0 ? (
                <p className="text-center opacity-50 py-8">No announcements yet</p>
              ) : (
                announcements.slice(0, 10).map(a => (
                  <div key={a.id} className="bg-slate-800/70 p-5 rounded-xl">
                    <p className="font-bold text-emerald-400">{a.title}</p>
                    <p className="text-sm mt-1 opacity-90">{a.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}