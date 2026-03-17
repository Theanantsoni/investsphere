import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Upload,
  ShieldCheck,
  Plus,
  Clock,
} from "lucide-react";

const API = "http://localhost:5000/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("investsphere_user")
        );

        if (!storedUser || !storedUser.email) {
          setError("User not logged in");
          return;
        }

        const email = storedUser.email;

        const res = await fetch(`${API}/users/profile/${email}`);

        if (!res.ok) throw new Error("API failed");

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON response");
        }

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchProfile();
  }, []);

  /* ================= IMAGE SELECT ================= */

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(selected.type)) {
      alert("Only JPG, PNG, WEBP allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert("Max file size 5MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("investsphere_user"));
      const email = storedUser?.email;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", email);

      const res = await fetch(`${API}/users/upload-profile`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setPreview(null);
        setFile(null);
        alert("Profile updated ✅");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  /* ================= STATES ================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 flex items-center gap-6 text-white">

          {/* PROFILE IMAGE */}
          <div className="relative group">
            <img
              src={
                preview ||
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${user.name}`
              }
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />

            <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Plus size={22} className="text-white" />
              <span className="text-xs text-white mt-1">
                Upload Photo
              </span>
              <input type="file" hidden onChange={handleImageChange} />
            </label>
          </div>

          {/* USER INFO */}
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="opacity-90">{user.email}</p>

            {file && (
              <button
                onClick={handleUpload}
                className="mt-3 px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-medium shadow hover:scale-105 transition"
              >
                {loading ? "Uploading..." : "Save Photo"}
              </button>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-10 grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <ProfileItem icon={<User />} label="Name" value={user.name} />
          <ProfileItem icon={<Mail />} label="Email" value={user.email} />
          <ProfileItem icon={<Phone />} label="Phone" value={user.phone} />
          <ProfileItem icon={<CreditCard />} label="PAN" value={user.pan} />

          {/* RIGHT */}
          <ProfileItem icon={<MapPin />} label="Country" value={user.country} />
          <ProfileItem icon={<MapPin />} label="State" value={user.state} />

          {/* DOB LEFT */}
          <ProfileItem
            icon={<Calendar />}
            label="DOB"
            value={formatDate(user.dob)}
          />

          {/* VERIFIED RIGHT (NEW FIELD) */}
          <div className="flex gap-4 items-start">
            <div className="text-green-600 mt-1">
              <ShieldCheck />
            </div>

            <div>
              <p className="text-sm text-gray-500">Verification</p>

              {user.verified ? (
                <p className="font-semibold text-green-600">Verified</p>
              ) : (
                <p className="font-semibold text-red-500">Not Verified</p>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t px-10 py-4 bg-gray-50 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-2">

          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              Created: <b>{formatDate(user.createdAt)}</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              Updated: <b>{formatDate(user.updatedAt)}</b>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

/* ================= REUSABLE ITEM ================= */

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex gap-4 items-start">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  </div>
);

export default Profile;