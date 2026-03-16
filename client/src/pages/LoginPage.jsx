import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function maskEmail(email) {
  if (!email) return "";

  const [name, domain] = email.split("@");

  const firstThree = name.slice(0, 3);
  const lastTwo = name.slice(-2);

  const maskedLength = Math.max(name.length - 5, 0);
  const masked = "*".repeat(maskedLength);

  return `${firstThree}${masked}${lastTwo}@${domain}`;
}

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

  /* ================= LOGIN ================= */

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
        localStorage.setItem(
          "investsphere_user",
          JSON.stringify(res.data.user),
        );

        toast.success("Login successful", { duration: 3000 });

        setTimeout(() => {
          navigate("/");
        }, 800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 3000,
      });
    }

    setLoading(false);
  };

  /* ================= SEND OTP ================= */

  const sendOTP = async () => {
    if (!email) {
      toast.error("Enter email first", { duration: 3000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/send-otp",
        { email },
      );

      if (res.data.success) {
        toast.success("OTP sent successfully", { duration: 3000 });
        setStep("otp");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 3000,
      });
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP", { duration: 3000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/verify-otp",
        { email, otp },
      );

      if (res.data.success) {
        toast.success("OTP verified", { duration: 3000 });
        setStep("reset");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP", {
        duration: 3000,
      });
    }
  };

  /* ================= RESET PASSWORD ================= */

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Fill all password fields", { duration: 3000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { duration: 3000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/reset",
        {
          email,
          password,
        },
      );

      if (res.data.success) {
        localStorage.setItem("investsphere_user", JSON.stringify({ email }));

        toast.success("Password updated", { duration: 3000 });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 3000,
      });
    }
  };

  /* ================= PHONE INPUT VALIDATION ================= */

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setPhone(value);
    }
  };

  /* ================= FIND EMAIL BY MOBILE ================= */

  const findEmails = async () => {
    if (phone.length !== 10) {
      toast.error("Enter valid 10 digit mobile number", { duration: 3000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/find-email-by-mobile",
        { phone },
      );

      if (!res.data.emails || res.data.emails.length === 0) {
        toast.error("No email found", { duration: 3000 });
        return;
      }

      const maskedList = res.data.emails.map((item) => ({
        email: item.email,
        masked: maskEmail(item.email),
      }));

      setEmails(maskedList);

      toast.success("Emails found", { duration: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 3000,
      });
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>

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
          <Link to="/register" className="text-green-600 ml-1 hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* ================= FORGOT PASSWORD POPUP ================= */}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-center">
              Reset Password
            </h3>

            {step === "email" && (
              <>
                <input
                  placeholder="Enter email"
                  value={maskedEmail || email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!maskedEmail}
                  className="w-full border p-3 rounded-lg bg-gray-50"
                />

                <button
                  onClick={sendOTP}
                  className="w-full bg-green-500 text-white p-3 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />

                <button
                  onClick={verifyOTP}
                  className="w-full bg-green-500 text-white p-3 rounded-lg"
                >
                  Verify OTP
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-green-500 text-white p-3 rounded-lg"
                >
                  Update Password
                </button>
              </>
            )}

            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-center w-full text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= FIND EMAIL POPUP ================= */}

      {showFindEmail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-center">Find Email</h3>

            <input
              placeholder="Enter mobile number"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={findEmails}
              className="w-full bg-green-500 text-white p-3 rounded-lg"
            >
              Find Emails
            </button>

            <div className="space-y-2">
              {emails.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(item.email);
                    setMaskedEmail(item.masked);
                    setShowFindEmail(false);
                    setShowForgotPassword(true);
                    setStep("email");
                  }}
                  className="w-full border rounded-lg p-3 hover:bg-gray-50"
                >
                  {item.masked}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFindEmail(false)}
              className="w-full text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
