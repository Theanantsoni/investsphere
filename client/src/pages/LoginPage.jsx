import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

/* ======================================================
   EMAIL MASK
====================================================== */

function maskEmail(email) {
  if (!email) return "";

  const [name, domain] = email.split("@");

  const firstThree = name.slice(0, 3);
  const lastTwo = name.slice(-2);

  const maskedLength = Math.max(name.length - 5, 0);
  const masked = "*".repeat(maskedLength);

  return `${firstThree}${masked}${lastTwo}@${domain}`;
}

/* ======================================================
   COMPONENT
====================================================== */

function LoginPage() {
  const navigate = useNavigate();

  /* ================= LOGIN STATE ================= */

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= POPUP STATES ================= */

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showFindEmail, setShowFindEmail] = useState(false);

  const [step, setStep] = useState("email");

  /* ================= FORGOT STATES ================= */

  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emails, setEmails] = useState([]);

  /* ======================================================
     LOGIN
  ====================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/login", form);

      if (res.data.success) {

        const userData = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
        };

        localStorage.setItem(
          "investsphere_user",
          JSON.stringify(userData)
        );

        toast.success("Login successful", { duration: 3000 });

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 700);
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error",
        { duration: 3000 }
      );

    }

    setLoading(false);
  };

  /* ======================================================
     SEND OTP
  ====================================================== */

  const sendOTP = async () => {
    if (!email) {
      toast.error("Enter email first");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/send-otp",
        { email }
      );

      if (res.data.success) {
        toast.success("OTP sent successfully");
        setStep("otp");
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error"
      );

    }
  };

  /* ======================================================
     VERIFY OTP
  ====================================================== */

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/verify-otp",
        { email, otp }
      );

      if (res.data.success) {
        toast.success("OTP verified");
        setStep("reset");
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Invalid OTP"
      );

    }
  };

  /* ======================================================
     RESET PASSWORD
  ====================================================== */

  const resetPassword = async () => {

    if (!password || !confirmPassword) {
      toast.error("Fill all password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/reset",
        { email, password }
      );

      if (res.data.success) {

        const loginRes = await axios.post(
          "http://localhost:5000/api/login",
          { email, password }
        );

        if (loginRes.data.success) {

          const userData = {
            id: loginRes.data.user.id,
            name: loginRes.data.user.name,
            email: loginRes.data.user.email,
          };

          localStorage.setItem(
            "investsphere_user",
            JSON.stringify(userData)
          );

          toast.success("Password updated");

          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 700);
        }
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error"
      );

    }
  };

  /* ======================================================
     PHONE INPUT VALIDATION
  ====================================================== */

  const handlePhoneChange = (e) => {

    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setPhone(value);
    }
  };

  /* ======================================================
     FIND EMAIL BY MOBILE
  ====================================================== */

  const findEmails = async () => {

    if (phone.length !== 10) {
      toast.error("Enter valid mobile number");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/find-email-by-mobile",
        { phone }
      );

      if (!res.data.emails || res.data.emails.length === 0) {
        toast.error("No email found");
        return;
      }

      const maskedList = res.data.emails.map((item) => ({
        email: item.email,
        masked: maskEmail(item.email),
      }));

      setEmails(maskedList);

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error"
      );

    }
  };

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative">

      <Toaster position="top-right" />

      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">

        <h2 className="text-3xl font-bold text-center mb-2">
          Invest<span className="text-green-500">Sphere</span>
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* LINKS */}

        <div className="flex justify-between mt-4 text-sm">

          <button
            onClick={() => {
              setShowForgotPassword(true);
              setStep("email");
            }}
            className="text-green-600 hover:underline"
          >
            Forgot Password
          </button>

          <button
            onClick={() => setShowFindEmail(true)}
            className="text-green-600 hover:underline"
          >
            Forgot Email
          </button>

        </div>

        <p className="text-center mt-6 text-sm">
          Don't have account?
          <Link
            to="/register"
            className="text-green-600 ml-1 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;