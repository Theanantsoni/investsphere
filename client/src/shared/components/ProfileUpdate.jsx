import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!verifyEmail) {
      toast.error("Enter verification email");
      return;
    }

    if (field === "phone") {
      if (!/^[0-9]{10}$/.test(value)) {
        toast.error("Enter valid 10 digit mobile number");
        return;
      }
    }

    if (field === "password") {
      if (!value || !confirmPassword) {
        toast.error("Fill password fields");
        return;
      }

      if (value !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      await axios.post("/api/profile/send-otp", {
        email: verifyEmail,
        field,
        value,
      });

      toast.success("OTP sent to email");

      setStep(2);
    } catch {
      toast.error("Update request failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/profile/verify-otp", {
        email: verifyEmail,
        otp,
      });

      toast.success("Profile updated successfully");

      navigate("/profile");
    } catch (err) {
      if (err.response?.data?.message === "Invalid OTP") {
        toast.error("Invalid OTP");
      } else if (err.response?.data?.message === "OTP expired") {
        toast.error("OTP expired");
      } else {
        toast.error("Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h2 className="font-semibold text-lg">Update Profile</h2>

          <div />
        </div>

        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Field</option>
          <option value="phone">Mobile Number</option>
          <option value="password">Password</option>
        </select>

        {field === "phone" && (
          <input
            type="text"
            placeholder="Enter new mobile number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />
        )}

        {field === "password" && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />
          </>
        )}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter verification email"
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
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
