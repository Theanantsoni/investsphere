// admin/src/components/MessageHistoryModal.jsx

import { useEffect, useRef, useState } from "react";
import {
  getAllMessages,
  getMessagesByEmail,
  getAllEmails,
} from "../services/messageService";
import { X, Mail, Search, ChevronDown } from "lucide-react";

const MessageHistoryModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = selectedEmail
        ? await getMessagesByEmail(selectedEmail)
        : await getAllMessages();

      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchEmails = async () => {
    const res = await getAllEmails();
    setEmails(res.emails || []);
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      fetchEmails();
    }
  }, [open, selectedEmail]);

  /* ===== OUTSIDE CLICK ===== */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!open) return null;

  const filteredEmails = emails.filter((e) =>
    e.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fadeIn">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Message History
            </h2>
            <p className="text-xs text-gray-400">
              View all sent messages and filter by user
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            <X size={18} className="text-gray-300" />
          </button>
        </div>

        {/* FILTER */}
        <div className="p-5 border-b border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Mail size={16} />
            Filter by User Email
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 hover:border-indigo-500 transition"
            >
              <span>
                {selectedEmail ? selectedEmail : "All Users"}
              </span>
              <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-3 space-y-3">
                
                {/* SEARCH */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    placeholder="Search email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 text-white rounded-lg outline-none border border-gray-700 focus:border-indigo-500"
                  />
                </div>

                {/* OPTIONS */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  <div
                    onClick={() => {
                      setSelectedEmail("");
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-sm text-white hover:bg-gray-800 rounded cursor-pointer"
                  >
                    All Users
                  </div>

                  {filteredEmails.map((email, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedEmail(email);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-sm rounded cursor-pointer transition ${
                        selectedEmail === email
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 max-h-[500px] overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No messages found
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-gray-800/70 backdrop-blur-md p-5 rounded-xl border border-gray-700 hover:border-indigo-500 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-white font-semibold text-base">
                    {msg.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  {msg.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.recipients.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-full"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageHistoryModal;