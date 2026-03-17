import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ======================================================
   AXIOS BASE CONFIG
====================================================== */

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     VALIDATION STATES
  ====================================================== */

  const isValidPhone = /^[0-9]{10}$/.test(value);
  const isPasswordValid = value.length >= 6;
  const isPasswordMatch = value === confirmPassword;

  /* ======================================================
     GET LOGGED USER
  ====================================================== */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("investsphere_user"));

    if (user?.email) {
      setVerifyEmail(user.email);
    } else {
      toast.error("Please login first", { duration: 3000 });
      navigate("/login");
    }
  }, []);

  /* ======================================================
     HANDLE PHONE INPUT (STRICT CONTROL)
  ====================================================== */

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // remove non-digits

    if (input.length > 10) {
      input = input.slice(0, 10); // max 10 digits
    }

    setValue(input);
  };

  /* ======================================================
     SEND OTP
  ====================================================== */

  const sendOTP = async () => {
    if (!field) {
      toast.error("Select field first", { duration: 3000 });
      return;
    }

    if (field === "phone") {
      if (!isValidPhone) {
        toast.error("Mobile must be exactly 10 digits", {
          duration: 3000,
        });
        return;
      }
    }

    if (field === "password") {
      if (!value || !confirmPassword) {
        toast.error("Fill all password fields", { duration: 3000 });
        return;
      }

      if (!isPasswordValid) {
        toast.error("Password must be at least 6 characters", {
          duration: 3000,
        });
        return;
      }

      if (!isPasswordMatch) {
        toast.error("Passwords do not match", { duration: 3000 });
        return;
      }
    }

    try {
      setLoading(true);

      await API.post("/profile/send-otp", {
        email: verifyEmail,
        field,
        value,
      });

      toast.success(
        field === "phone"
          ? "OTP sent for mobile update"
          : "OTP sent for password update",
        { duration: 3000 },
      );

      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     VERIFY OTP
  ====================================================== */

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP", { duration: 3000 });
      return;
    }

    try {
      setLoading(true);

      await API.post("/profile/verify-otp", {
        email: verifyEmail,
        otp,
      });

      if (field === "phone") {
        toast.success("Mobile number updated successfully");
      } else if (field === "password") {
        toast.success("Password updated successfully");
      }

      /* RESET */
      setStep(1);
      setField("");
      setValue("");
      setConfirmPassword("");
      setOtp("");

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Invalid OTP") {
        toast.error("Invalid OTP");
      } else if (message === "OTP expired") {
        toast.error("OTP expired");
      } else {
        toast.error(message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     DISABLE BUTTON LOGIC
  ====================================================== */

  const isSendDisabled =
    loading ||
    !field ||
    (field === "phone" && !isValidPhone) ||
    (field === "password" &&
      (!isPasswordValid || !isPasswordMatch || !confirmPassword));

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            Update Profile
          </h2>

          <div />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm text-gray-500 mb-1 block">
            Logged-in Email
          </label>
          <input
            type="email"
            value={verifyEmail}
            disabled
            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* FIELD */}
        <div className="mb-5">
          <label className="text-sm text-gray-500 mb-1 block">
            Select Field
          </label>
          <select
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setValue("");
              setConfirmPassword("");
            }}
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">Choose option</option>
            <option value="phone">Mobile Number</option>
            <option value="password">Password</option>
          </select>
        </div>

        {/* PHONE */}
        {field === "phone" && (
          <>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter 10-digit mobile number"
              value={value}
              onChange={handlePhoneChange}
              className={`w-full border rounded-xl p-3 mb-2 outline-none transition ${
                value && !isValidPhone
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />

            {value && !isValidPhone && (
              <p className="text-sm text-red-500">
                Mobile number must be exactly 10 digits
              </p>
            )}
          </>
        )}

        {/* PASSWORD */}
        {field === "password" && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 mb-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded-xl p-3 mb-2 outline-none transition ${
                confirmPassword && !isPasswordMatch
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />

            {confirmPassword && !isPasswordMatch && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </>
        )}

        {/* STEP BUTTONS */}
        {step === 1 && (
          <button
            onClick={sendOTP}
            disabled={isSendDisabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-green-500 outline-none transition"
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileUpdate;
