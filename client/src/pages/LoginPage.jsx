import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Please enter email and password");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/login",
        form,
      );

      if (response.data.success) {
        /* ===============================
           STORE USER IN LOCAL STORAGE
        =============================== */

        localStorage.setItem(
          "investsphere_user",
          JSON.stringify(response.data.user),
        );

        /* ===============================
           REDIRECT HOME
        =============================== */

        navigate("/");

        /* reload to update navbar */

        window.location.reload();
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-6">
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[160px] opacity-40 top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-200 blur-[160px] opacity-40 bottom-[-200px] right-[-200px]" />

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-14 items-center">
        <div className="hidden md:flex flex-col items-center text-center">
          <img src="/Images/27.png" alt="InvestSphere" className="w-[360px]" />

          <h2 className="text-3xl font-bold text-gray-800 mt-6">
            Invest<span className="text-green-500">Sphere</span>
          </h2>

          <p className="text-gray-500 mt-3 max-w-sm">
            Access your portfolio, track stocks, apply for IPOs and manage SIP
            investments with real-time insights.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Login
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Sign in to your InvestSphere account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm">Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-gray-50 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-500 hover:text-green-600"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
