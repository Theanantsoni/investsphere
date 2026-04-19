import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { changePassword } from "../services/securityService";
import toast from "react-hot-toast";

const SecurityPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error("All fields are required", { duration: 2000 });
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match", { duration: 2000 });
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        duration: 2000,
      });
    }

    if (form.currentPassword === form.newPassword) {
      return toast.error("New password must be different", {
        duration: 2000,
      });
    }

    try {
      setLoading(true);

      const res = await changePassword({
        currentPassword: form.currentPassword.trim(),
        newPassword: form.newPassword.trim(),
      });

      if (res?.success) {
        toast.success(res.message || "Password updated", {
          duration: 2000,
        });

        const storedUser = JSON.parse(localStorage.getItem("user"));

        const loginRes = await axios.post(
          "http://localhost:5000/api/login",
          {
            email: storedUser?.user?.email,
            password: form.newPassword.trim(),
          }
        );

        if (loginRes.data.success) {
          const newUserData = {
            token: loginRes.data.token,
            user: loginRes.data.user,
          };

          localStorage.setItem("user", JSON.stringify(newUserData));

          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          setTimeout(() => {
            navigate("/");
          }, 700);
        }
      } else {
        toast.error(res?.message || "Failed to update password", {
          duration: 2000,
        });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error updating password";

      toast.error(message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldCheck size={18} className="text-blue-600" />
          Security Settings
        </div>

        <div />
      </div>

      {/* CARD */}
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CURRENT PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            <label className="text-sm text-slate-600">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              className="md:col-span-2 w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            <label className="text-sm text-slate-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              className="md:col-span-2 w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            <label className="text-sm text-slate-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="md:col-span-2 w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 shadow"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;