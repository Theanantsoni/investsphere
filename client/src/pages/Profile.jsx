import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  User,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("investsphere_user"));

      const email = storedUser?.email;

      const res = await fetch(
        `http://localhost:5000/api/users/profile/${email}`,
      );

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 flex items-center gap-6 text-white">
          <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-blue-100">{user.email}</p>
          </div>
        </div>

        {/* DETAILS */}

        <div className="p-10 grid md:grid-cols-2 gap-8">
          <ProfileItem icon={<User />} label="Full Name" value={user.name} />

          <ProfileItem icon={<Mail />} label="Email" value={user.email} />

          <ProfileItem icon={<Phone />} label="Phone" value={user.phone} />

          <ProfileItem icon={<CreditCard />} label="PAN" value={user.pan} />

          <ProfileItem icon={<MapPin />} label="Country" value={user.country} />

          <ProfileItem icon={<MapPin />} label="State" value={user.state} />

          <ProfileItem
            icon={<Calendar />}
            label="Date of Birth"
            value={formatDate(user.dob)}
          />

          <ProfileItem
            icon={<ShieldCheck />}
            label="Verification"
            value={user.verified ? "Verified Account" : "Not Verified"}
            color={user.verified ? "text-green-600" : "text-red-500"}
          />

          <ProfileItem
            icon={<Calendar />}
            label="Account Created"
            value={formatDate(user.createdAt)}
          />

          <ProfileItem
            icon={<Calendar />}
            label="Last Updated"
            value={formatDate(user.updatedAt)}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENT ================= */

const ProfileItem = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="text-blue-600">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`font-semibold ${color || "text-gray-800"}`}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
