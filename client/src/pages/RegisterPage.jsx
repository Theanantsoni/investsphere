import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import API from "../config/api";

function RegisterPage() {
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    pan: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const [errorModal, setErrorModal] = useState("");

  // ==============================
  // TOAST FUNCTION
  // ==============================

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 3500);
  };

  // ==============================
  // VALIDATIONS
  // ==============================

  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const validateAge = (dob) => {
    const today = new Date();
    const birth = new Date(dob);

    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age >= 18;
  };

  // ==============================
  // FIELD VALIDATION
  // ==============================

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Full name required";
        break;

      case "email":
        if (!validateEmail(value)) error = "Enter valid email";
        break;

      case "phone":
        if (!validatePhone(value)) error = "Phone must be 10 digits";
        break;

      case "state":
        if (!value) error = "State required";
        break;

      case "pan":
        if (!validatePan(value)) error = "Invalid PAN format";
        break;

      case "dob":
        if (!value) error = "Date of birth required";
        else if (!validateAge(value)) error = "You must be 18+";
        break;

      case "password":
        if (value.length < 6) error = "Password must be minimum 6 characters";
        break;

      case "confirmPassword":
        if (value !== form.password) error = "Passwords do not match";
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone") newValue = value.replace(/\D/g, "");
    if (name === "pan") newValue = value.toUpperCase();
    if (name === "name") newValue = value.replace(/[^A-Za-z\s]/g, "");

    if (name === "email") {
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  // ==============================
  // FORM VALIDATION
  // ==============================

  const validateForm = () => {
    const e = {};

    if (!form.name) e.name = "Full name required";

    if (!validateEmail(form.email)) e.email = "Enter valid email";

    if (!validatePhone(form.phone)) e.phone = "Phone must be 10 digits";

    if (!form.state) e.state = "State required";

    if (!validatePan(form.pan)) e.pan = "Invalid PAN format";

    if (!form.dob) e.dob = "Date of birth required";
    else if (!validateAge(form.dob)) e.dob = "You must be 18+";

    if (form.password.length < 6)
      e.password = "Password must be minimum 6 characters";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (!captchaToken) e.captcha = "Please verify captcha";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // ==============================
  // SEND OTP
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =============================
    // FORM VALIDATION
    // =============================

    if (!validateForm()) return;

    // =============================
    // CAPTCHA VALIDATION
    // =============================

    if (!captchaToken) {
      setErrors((prev) => ({
        ...prev,
        captcha: "Please verify captcha",
      }));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/register/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.email,
          recaptchaToken: captchaToken,
        }),
      });

      const data = await res.json();

      // =============================
      // API ERROR
      // =============================

      if (!res.ok) {
        if (data.message.includes("already registered")) {
          setErrorModal(data.message);
        } else {
          showToast(data.message || "Failed to send OTP", "error");
        }

        setLoading(false);
        return;
      }

      // =============================
      // SUCCESS
      // =============================

      showToast("OTP sent successfully to your email");

      setShowOTP(true);

      // reset captcha

      recaptchaRef.current.reset();
      setCaptchaToken("");
    } catch (error) {
      showToast("Server error", "error");
    }

    setLoading(false);
  };

  // ==============================
  // VERIFY OTP
  // ==============================

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      showToast("Enter valid 6 digit OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/register/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          email: form.email,
          otp,
          form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Invalid OTP", "error");
        setLoading(false);
        return;
      }

      showToast("Email verified successfully");

      setShowOTP(false);
      setSuccessModal(true);
    } catch {
      showToast("OTP verification failed", "error");
    }

    setLoading(false);
  };

  const cancelOTP = () => {
    setOtp("");
    setShowOTP(false);
  };

  const handleSuccess = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      {/* TOAST */}

      {errorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 text-center animate-fadeIn">
            {/* ICON */}

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
            </div>

            {/* TITLE */}

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Registration Error
            </h2>

            {/* MESSAGE */}

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {errorModal}
            </p>

            {/* BUTTON */}

            <button
              onClick={() => {
                setErrorModal("");

                recaptchaRef.current.reset();
                setCaptchaToken("");
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
            toastType === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast}
        </div>
      )}

      {/* OTP MODAL */}

      {showOTP && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[420px] text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Email Verification</h2>

            <p className="text-gray-600 text-sm mb-4">
              We have sent a 6 digit verification code to
            </p>

            <p className="font-semibold text-gray-800 mb-6">{form.email}</p>

            <div className="bg-gray-50 border rounded-lg p-4 mb-6 text-left text-sm text-gray-600">
              <p className="mb-2">OTP Instructions:</p>

              <ul className="list-disc pl-5 space-y-1">
                <li>Enter the 6 digit OTP sent to your email</li>
                <li>OTP is valid for 5 minutes</li>
                <li>Do not share OTP with anyone</li>
                <li>If OTP expired request new registration</li>
              </ul>
            </div>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6 digit OTP"
              className="w-full border p-3 rounded-lg mb-5 text-center text-lg tracking-widest"
            />

            <div className="flex gap-3">
              <button
                onClick={cancelOTP}
                className="w-1/2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}

      {successModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Registration Successful
            </h2>

            <p className="text-gray-600 mb-6">
              Your account has been created successfully.
            </p>

            <button
              onClick={handleSuccess}
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center py-28">
        {/* LEFT SIDE */}

        <div className="hidden md:flex flex-col h-full pr-12 pt-12 border-r border-gray-200">
          {/* BACK BUTTON */}

          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 
  bg-white border border-gray-200 px-4 py-2 rounded-lg 
  hover:bg-green-50 hover:text-green-600 hover:border-green-300
  transition-all duration-200 shadow-sm"
          >
            <span className="text-lg transform group-hover:-translate-x-1 transition">
              ←
            </span>
            Back to Home
          </button>

          {/* LOGO */}

          <div className="flex items-center gap-3 my-2">
            <img src="/Images/27.png" alt="InvestSphere" className="w-[70px]" />

            <span className="text-xl font-semibold">
              <span className="text-red-700">Join </span>
              <span className="text-gray-900">Invest</span>
              <span className="text-green-600">Sphere</span>
            </span>
          </div>

          {/* DESCRIPTION */}

          <p className="mt-4 text-gray-600 leading-relaxed max-w-md">
            Build your investment future with powerful tools designed to help
            you track stocks, IPOs and SIP investments all in one place.
          </p>

          {/* SECTION HEADER */}

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Why create an account?
          </h3>

          {/* FEATURES LIST */}

          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <span className="text-green-600 text-lg">★</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Create your personal{" "}
                <span className="font-semibold">Watchlist</span> to monitor your
                favorite stocks instantly.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <span className="text-green-600 text-lg">★</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Save and track <span className="font-semibold">Stocks</span>{" "}
                with detailed analytics, performance insights and charts.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <span className="text-green-600 text-lg">★</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Bookmark upcoming <span className="font-semibold">IPOs</span>{" "}
                and view subscription data instantly.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <span className="text-green-600 text-lg">★</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Track <span className="font-semibold">SIP investments</span> and
                analyze long-term wealth growth.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <span className="text-green-600 text-lg">★</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Access detailed{" "}
                <span className="font-semibold">
                  Stock, IPO and SIP insights
                </span>{" "}
                to make smarter investment decisions.
              </p>
            </div>
          </div>

          {/* BOTTOM INFO BOX */}

          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              🔒 Your investment preferences are securely stored and only used
              to provide personalized insights and tools.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}

        <div className="bg-white border border-gray-200 rounded-2xl px-12 py-10 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 text-center mb-10 text-sm">
            Register your InvestSphere account
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
          >
            {/* FULL NAME */}

            <div className="md:col-span-2 flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* MOBILE NUMBER */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Mobile Number
              </label>

              <input
                name="phone"
                maxLength="10"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit mobile number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* COUNTRY */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                value="India"
                disabled
                className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* STATE */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">State</label>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your state"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state}</p>
              )}
            </div>

            {/* PAN */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                PAN Number
              </label>

              <input
                name="pan"
                maxLength="10"
                value={form.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.pan && (
                <p className="text-red-500 text-xs">{errors.pan}</p>
              )}
            </div>

            {/* DOB */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob}</p>
              )}
            </div>

            {/* PASSWORD */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            {/* CAPTCHA */}

            {/* CAPTCHA */}

            <div className="md:col-span-2 flex flex-col items-center pt-4 space-y-2">
              <ReCAPTCHA
                sitekey="6LdUTocsAAAAAEn6z5FMZItpG68ClrIFsNiBVuiQ"
                ref={recaptchaRef}
                onChange={(token) => {
                  setCaptchaToken(token);

                  setErrors((prev) => ({
                    ...prev,
                    captcha: "",
                  }));
                }}
              />

              {errors.captcha && (
                <p className="text-red-500 text-xs text-center">
                  {errors.captcha}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-green-500 hover:bg-green-600
    text-white font-semibold py-3 rounded-lg transition duration-200 shadow-sm"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Already have an account?
            <Link
              to="/login"
              className="text-green-600 font-medium ml-1 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
