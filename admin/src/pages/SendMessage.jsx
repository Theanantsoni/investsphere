// admin/src/pages/SendMessage.jsx

import { useEffect, useRef, useState } from "react";
import {
  getAllEmails,
  sendMessage,
  getSuggestions,
} from "../services/messageService";
import MessageHistoryModal from "../components/MessageHistoryModal";
import toast from "react-hot-toast";
import { ChevronDown, Users, X } from "lucide-react";

const SendMessage = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [messageType, setMessageType] = useState("general");

  const [suggestions, setSuggestions] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const dropdownRef = useRef();

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchEmails();
    fetchSuggestions();
  }, []);

  const fetchEmails = async () => {
    const res = await getAllEmails();
    setEmails(res.emails || []);
  };

  const fetchSuggestions = async () => {
    const res = await getSuggestions();
    setSuggestions(res.suggestions || []);
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================= SELECT ================= */
  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const selectAll = () => setSelectedEmails(emails);
  const clearAll = () => setSelectedEmails([]);

  const filteredEmails = emails.filter((e) =>
    e.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || selectedEmails.length === 0) {
      toast.error("All fields required", { duration: 2000 });
      return;
    }

    try {
      await sendMessage({
        title,
        description,
        recipients: selectedEmails,
        messageType,
      });

      toast.success("Message sent", { duration: 2000 });

      setTitle("");
      setDescription("");
      setSelectedEmails([]);
    } catch (err) {
      toast.error("Failed", { duration: 2000 });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Send Message
          </h1>
          <p className="text-gray-400 text-sm">
            Send updates, alerts, and notifications to users
          </p>
        </div>

        <button
          onClick={() => setHistoryOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition text-white font-medium shadow-lg"
        >
          View History
        </button>
      </div>

      {/* MAIN GRID */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* LEFT PANEL - USERS */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Users size={18} />
            Select Users
          </div>

          {/* SELECTED CHIPS */}
          <div className="flex flex-wrap gap-2">
            {selectedEmails.map((email, i) => (
              <span
                key={i}
                className="flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-xs"
              >
                {email}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => toggleEmail(email)}
                />
              </span>
            ))}
          </div>

          {/* DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 hover:border-indigo-500 transition"
            >
              <span>
                {selectedEmails.length > 0
                  ? `${selectedEmails.length} users selected`
                  : "Select Users"}
              </span>
              <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-3 space-y-3">
                {/* SEARCH */}
                <input
                  placeholder="Search email..."
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg outline-none border border-gray-700 focus:border-indigo-500"
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                  >
                    Clear
                  </button>
                </div>

                {/* LIST */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {filteredEmails.map((email, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-gray-800 px-2 py-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(email)}
                        onChange={() => toggleEmail(email)}
                      />
                      {email}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          {/* TYPE (TOP) */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Message Type
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:border-indigo-500 outline-none"
            >
              <option value="general">General</option>
              <option value="market_update">Market Update</option>
              <option value="stock_alert">Stock Alert</option>
              <option value="ipo_alert">IPO Alert</option>
              <option value="sip_update">SIP Update</option>
              <option value="wallet_update">Wallet</option>
              <option value="news">News</option>
              <option value="offer">Offer</option>
            </select>
          </div>

          {/* SUGGESTIONS */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setTitle(s.title);
                  setDescription(s.description);
                  setMessageType(s.type);
                }}
                className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/20 px-3 py-1.5 rounded-full text-indigo-300 transition"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* TITLE */}
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:border-indigo-500 outline-none"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:border-indigo-500 outline-none h-36 resize-none"
          />

          {/* SUBMIT */}
          <button className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-xl text-white font-semibold shadow-lg">
            Send Message
          </button>
        </div>
      </form>

      {/* MODAL */}
      <MessageHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
};

export default SendMessage;