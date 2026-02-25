import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const IPOApplyPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    investorCategory: "Retail",
    lots: 1,
    upiId: "",
    pan: "",
    demat: "",
    bank: "",
    agree: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("Please accept terms & conditions");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <CheckCircle className="text-green-600 mb-4" size={60} />
        <h2 className="text-2xl font-semibold mb-2">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-600">
          This is a demo submission for IPO: <b>{symbol}</b>
        </p>
        <button
          onClick={() => navigate("/ipo")}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Back to IPO Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-16">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">

        <h1 className="text-3xl font-bold mb-6">
          Apply for IPO: {symbol}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Investor Category */}
          <div>
            <label className="block font-medium mb-2">
              Investor Category
            </label>
            <select
              name="investorCategory"
              value={formData.investorCategory}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Retail</option>
              <option>HNI</option>
            </select>
          </div>

          {/* Lots */}
          <div>
            <label className="block font-medium mb-2">
              Number of Lots
            </label>
            <input
              type="number"
              name="lots"
              min="1"
              value={formData.lots}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block font-medium mb-2">UPI ID</label>
            <input
              type="text"
              name="upiId"
              placeholder="example@upi"
              value={formData.upiId}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="block font-medium mb-2">PAN Number</label>
            <input
              type="text"
              name="pan"
              placeholder="ABCDE1234F"
              value={formData.pan}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Demat */}
          <div>
            <label className="block font-medium mb-2">
              Demat Account Number
            </label>
            <input
              type="text"
              name="demat"
              value={formData.demat}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block font-medium mb-2">Bank Name</label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Agree */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label>I agree to demo terms & conditions</label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            Submit Application
          </button>

        </form>
      </div>
    </div>
  );
};

export default IPOApplyPage;
