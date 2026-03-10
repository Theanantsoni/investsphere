import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    pan: "",
    dob: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.country ||
      !form.state ||
      !form.pan ||
      !form.dob
    ) {
      setError("Please fill all fields");
      return;
    }

    setError("");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-6">
      {/* Light Glow Background */}

      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[160px] opacity-40 top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-200 blur-[160px] opacity-40 bottom-[-200px] right-[-200px]" />

      {/* Main Container */}

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-14 items-center">
        {/* LEFT SIDE IMAGE */}

        <div className="hidden md:flex flex-col items-center text-center">
          <img src="/Images/27.png" alt="InvestSphere" className="w-[360px]" />

          <h2 className="text-3xl font-bold text-gray-800 mt-6">
            Invest<span className="text-green-500">Sphere</span>
          </h2>

          <p className="text-gray-500 mt-3 max-w-sm">
            Start investing in Stocks, IPOs and SIP plans with powerful
            analytics and real-time market insights.
          </p>
        </div>

        {/* REGISTER FORM */}

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Create your InvestSphere account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* FULL NAME */}

            <div className="col-span-2">
              <label className="text-gray-700 text-sm">Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="text-gray-700 text-sm">Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="text-gray-700 text-sm">Phone</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* COUNTRY */}

            <div>
              <label className="text-gray-700 text-sm">Country</label>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* STATE */}

            <div>
              <label className="text-gray-700 text-sm">State</label>

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* PAN */}

            <div>
              <label className="text-gray-700 text-sm">PAN Number</label>

              <input
                type="text"
                name="pan"
                placeholder="ABCDE1234F"
                value={form.pan}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* DOB */}

            <div>
              <label className="text-gray-700 text-sm">Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:border-green-500"
              />
            </div>

            {/* SUBMIT */}

            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
              >
                Register
              </button>
            </div>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 hover:text-green-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
