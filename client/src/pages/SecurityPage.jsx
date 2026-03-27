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

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      // ✅ STEP 1: CHANGE PASSWORD
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (res.success) {
        toast.success("Password updated");

        // ✅ STEP 2: AUTO LOGIN
        const storedUser = JSON.parse(localStorage.getItem("user"));

        const loginRes = await axios.post(
          "http://localhost:5000/api/login",
          {
            email: storedUser.user.email,
            password: form.newPassword,
          }
        );

        if (loginRes.data.success) {
          const newUserData = {
            token: loginRes.data.token,
            user: loginRes.data.user,
          };

          localStorage.setItem("user", JSON.stringify(newUserData));

          // ✅ RESET FORM
          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          // ✅ REDIRECT HOME (NO LOGIN PAGE)
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto flex justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={20} /> Security
        </div>

        <div />
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;