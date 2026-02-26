import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Smartphone,
  Layers,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const IPOApplicationProcessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Page Load → GIF
  if (loading) {
    return <InvestSphereLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-6 md:px-16">

      {/* Back Button */}
<div className="mb-10">
  <button
    onClick={() => navigate("/ipo")}
    className="group inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-sm hover:bg-green-50 hover:shadow-md transition-all duration-200"
  >
    <ArrowLeft
      size={18}
      className="transition-transform duration-200 group-hover:-translate-x-1"
    />
    <span className="font-semibold">Back to IPO</span>
  </button>
</div>


      {/* Hero Section */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📊 IPO Application Process
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow this step-by-step real-life process to successfully apply
          for an IPO through your broker app using UPI mandate.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative border-l-4 border-green-500 pl-8 space-y-12">

        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="text-green-600" />
            <h3 className="text-xl font-semibold">
              1️⃣ Open a Demat & Trading Account
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Open a Demat account with a SEBI-registered broker like Zerodha,
            Upstox, Angel One etc. Complete KYC verification before applying.
          </p>
        </div>

        {/* Step 2 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="text-green-600" />
            <h3 className="text-xl font-semibold">
              2️⃣ Go to IPO Section in Broker App
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Login to your broker app → Navigate to IPO section →
            Select the IPO you want to apply for.
          </p>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-green-600" />
            <h3 className="text-xl font-semibold">
              3️⃣ Select Investor Category & Lot Size
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Choose Retail (₹2 lakh limit) or HNI category.
            Enter number of lots you want to apply for.
          </p>
        </div>

        {/* Step 4 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee className="text-green-600" />
            <h3 className="text-xl font-semibold">
              4️⃣ Enter UPI ID & Submit Application
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Enter your UPI ID correctly. Double-check details before submitting.
          </p>
        </div>

        {/* Step 5 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-green-600" />
            <h3 className="text-xl font-semibold">
              5️⃣ Approve UPI Mandate
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            You will receive a mandate request in your UPI app.
            Approve it within the deadline to block funds.
          </p>
        </div>

        {/* Step 6 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" />
            <h3 className="text-xl font-semibold">
              6️⃣ Check Allotment Status
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            After IPO closes, check allotment on registrar website.
            If allotted → shares credited. If not → money unblocked.
          </p>
        </div>

      </div>

      {/* Important Notes */}
      <div className="max-w-4xl mx-auto mt-16 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-yellow-600" />
          <h4 className="font-semibold">Important Notes</h4>
        </div>
        <ul className="text-sm text-gray-700 space-y-2 list-disc ml-6">
          <li>UPI mandate approval is mandatory.</li>
          <li>Funds are only blocked, not deducted initially.</li>
          <li>If IPO is oversubscribed, allotment is lottery based.</li>
          <li>Refund happens automatically if not allotted.</li>
        </ul>
      </div>

      {/* Checklist Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-green-50 border border-green-200 p-6 rounded-xl">
        <h4 className="font-semibold mb-4">✔ Before Applying Checklist</h4>
        <ul className="text-sm text-gray-700 space-y-2 list-disc ml-6">
          <li>Active Demat account</li>
          <li>Correct UPI ID linked to bank account</li>
          <li>Enough balance for lot amount</li>
          <li>Verified KYC details</li>
        </ul>
      </div>

    </div>
  );
};

export default IPOApplicationProcessPage;