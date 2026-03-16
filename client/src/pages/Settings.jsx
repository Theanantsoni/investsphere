import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "Profile Update",
      description: "Update email, phone number or password securely.",
      action: () => navigate("/profile-update"),
    },
    {
      title: "Security",
      description: "Manage password and authentication settings.",
      action: () => navigate("/security"),
    },
    {
      title: "Notifications",
      description: "Configure alerts, reminders and platform updates.",
      action: () => navigate("/notifications"),
    },
    {
      title: "Preferences",
      description: "Customize platform appearance and experience.",
      action: () => navigate("/preferences"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-3 text-gray-800 font-semibold text-lg">
          <SettingsIcon size={20} />
          InvestSphere Settings
        </div>

        <div />
      </div>

      {/* SETTINGS CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Settings</h1>

        <p className="text-gray-600 mb-8">
          Manage your InvestSphere account settings including profile updates,
          security preferences, notifications and platform personalization.
        </p>

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.action}
              className="border rounded-lg p-6 hover:shadow-md transition cursor-pointer hover:border-blue-500"
            >
              <h3 className="font-semibold text-gray-800 mb-2">
                {option.title}
              </h3>

              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;