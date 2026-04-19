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

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showFindEmail, setShowFindEmail] = useState(false);

  const [step, setStep] = useState("email");

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

    if (!form.email || !form.password) {
      toast.error("Email and password required", { duration: 2000 });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.success) {
        const userData = {
          token: res.data.token,
          user: res.data.user,
        };

        localStorage.setItem(
          "investsphere_user",
          JSON.stringify({
            token: res.data.token,
            ...res.data.user,
          })
        );

        console.log("STORED USER:", userData);

        toast.success("Login successful", { duration: 2000 });

        setTimeout(() => {
          navigate("/");
        }, 600);
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Server error", {
        duration: 2000,
      });
    }

    setLoading(false);
  };

  /* ======================================================
     SEND OTP
  ====================================================== */

  const sendOTP = async () => {
    if (!email) {
      toast.error("Enter email first", { duration: 2000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/send-otp",
        { email }
      );

      if (res.data.success) {
        toast.success("OTP sent", { duration: 2000 });
        setStep("otp");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 2000,
      });
    }
  };

  /* ======================================================
     VERIFY OTP
  ====================================================== */

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP", { duration: 2000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/verify-otp",
        {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }
      );

      if (res.data.success) {
        toast.success("OTP verified", { duration: 2000 });
        setStep("reset");
      }
    } catch (err) {
      console.log("VERIFY OTP ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Invalid OTP", {
        duration: 2000,
      });
    }
  };

  /* ======================================================
     RESET PASSWORD
  ====================================================== */

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Fill all password fields", { duration: 2000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password/reset",
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }
      );

      if (res.data.success) {
        const loginRes = await axios.post("http://localhost:5000/api/login", {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });

        if (loginRes.data.success) {
          const userData = {
            token: loginRes.data.token,
            user: loginRes.data.user,
          };

          localStorage.setItem(
            "investsphere_user",
            JSON.stringify({
              token: loginRes.data.token,
              ...loginRes.data.user,
            })
          );

          toast.success("Password updated & logged in", {
            duration: 2000,
          });

          setTimeout(() => {
            navigate("/");
          }, 700);
        }
      }
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Server error", {
        duration: 2000,
      });
    }
  };

  /* ======================================================
     PHONE INPUT
  ====================================================== */

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setPhone(value);
    }
  };

  /* ======================================================
     FIND EMAIL
  ====================================================== */

  const findEmails = async () => {
    if (phone.length !== 10) {
      toast.error("Enter valid mobile number", { duration: 2000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/find-email-by-mobile",
        { phone }
      );

      const maskedList = res.data.emails.map((item) => ({
        email: item.email,
        masked: maskEmail(item.email),
      }));

      setEmails(maskedList);
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />

      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border">
        <h2 className="text-3xl font-bold text-center mb-2">
          Invest<span className="text-green-500">Sphere</span>
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg"
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
            className="text-green-600"
          >
            Forgot Password
          </button>

          <button
            onClick={() => setShowFindEmail(true)}
            className="text-green-600"
          >
            Forgot Email
          </button>
        </div>

        <p className="text-center mt-6 text-sm">
          Don't have account?
          <Link to="/register" className="text-green-600 ml-1">
            Register
          </Link>
        </p>
      </div>

      {/* FORGOT PASSWORD POPUP */}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-center">
              Reset Password
            </h3>

            {step === "email" && (
              <>
                <input
                  placeholder="Enter email"
                  value={maskedEmail || email}
                  disabled={!!maskedEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-3 rounded"
                />

                <button
                  onClick={sendOTP}
                  className="w-full bg-green-500 text-white p-3 rounded"
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full border p-3 rounded"
                />

                <button
                  onClick={verifyOTP}
                  className="w-full bg-green-500 text-white p-3 rounded"
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
                  className="w-full border p-3 rounded"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-3 rounded"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-green-500 text-white p-3 rounded"
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

      {/* FIND EMAIL POPUP */}

      {showFindEmail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-center">Find Email</h3>

            <input
              placeholder="Enter mobile number"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full border p-3 rounded"
            />

            <button
              onClick={findEmails}
              className="w-full bg-green-500 text-white p-3 rounded"
            >
              Find Emails
            </button>

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
                className="w-full border p-3 rounded"
              >
                {item.masked}
              </button>
            ))}

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