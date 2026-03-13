import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

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

        <div></div>
      </div>

      {/* CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Settings
        </h1>

        <p className="text-gray-600 leading-relaxed">
          This is the InvestSphere settings page. Future configuration options
          like security preferences, notification settings, account privacy,
          and personalization features will appear here.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">

          <div className="border rounded-lg p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-2">
              Security
            </h3>
            <p className="text-sm text-gray-500">
              Manage password and authentication.
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-2">
              Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Configure alerts and updates.
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-2">
              Preferences
            </h3>
            <p className="text-sm text-gray-500">
              Customize platform experience.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;