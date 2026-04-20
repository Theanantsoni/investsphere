import { useEffect, useState } from "react";
import { Bell, RefreshCcw } from "lucide-react";
import { getUserNotifications } from "../services/notificationService";

/* ======================================================
   FORMAT DATE
====================================================== */
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     GET USER FROM LOCAL STORAGE
  ====================================================== */
  const getUserEmail = () => {
    try {
      const user = JSON.parse(localStorage.getItem("investsphere_user"));
      return user?.email || "";
    } catch {
      return "";
    }
  };

  /* ======================================================
     FETCH NOTIFICATIONS
  ====================================================== */
  const fetchNotifications = async () => {
    const email = getUserEmail();

    if (!email) return;

    setLoading(true);

    const res = await getUserNotifications(email);

    if (res.success) {
      setNotifications(res.data);
    }

    setLoading(false);
  };

  /* ======================================================
     LOAD ON MOUNT
  ====================================================== */
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-6">

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg">
            <Bell size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Notifications
            </h1>
            <p className="text-sm text-gray-500">
              Your latest updates and alerts
            </p>
          </div>
        </div>

        {/* REFRESH BUTTON */}
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto">

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">
              No notifications found
            </div>
          </div>
        ) : (
          /* LIST */
          <div className="grid gap-4">
            {notifications.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>{item.messageType}</span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* TYPE BADGE */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.messageType === "ipo_alert"
                        ? "bg-purple-100 text-purple-600"
                        : item.messageType === "stock_alert"
                        ? "bg-green-100 text-green-600"
                        : item.messageType === "market_update"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.messageType === "news"
                        ? "bg-blue-100 text-blue-600"
                        : item.messageType === "offer"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.messageType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;