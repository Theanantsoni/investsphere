import { useState } from "react";
import {
  ArrowLeft,
  Flag,
  ChevronDown,
  ChevronUp,
  X,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useReports from "../hooks/useReports";

/* ======================================================
   FAQ DATA
====================================================== */

const faqData = [
  {
    question: "I cannot login to my account",
    answer:
      "Try clearing your browser cache and cookies. Then try logging in again. If the issue continues, reset your password.",
  },
  {
    question: "Stock data is not loading",
    answer: "Check your internet connection and refresh the page.",
  },
  {
    question: "Watchlist is not saving",
    answer: "Ensure you are logged in properly. Try logging out and back in.",
  },
  {
    question: "IPO application is not submitting",
    answer: "Check if all required fields are filled correctly.",
  },
  {
    question: "Payment failed during investment",
    answer: "Verify payment method and ensure sufficient balance.",
  },
];

/* ======================================================
   COMPONENT
====================================================== */

const SendReport = () => {
  const navigate = useNavigate();

  const { submitReport, fetchReports, reports, loading } = useReports();

  const [openIndex, setOpenIndex] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [successPopup, setSuccessPopup] = useState(false);
  const [reportsPopup, setReportsPopup] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("investsphere_user"));

  /* ======================================================
     FAQ TOGGLE
  ====================================================== */

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* ======================================================
     SUBMIT REPORT
  ====================================================== */

  const handleSubmit = async () => {
    if (!title || !description) return;

    const response = await submitReport({
      title,
      description,
      userEmail: storedUser.email,
      userName: storedUser.name,
    });

    if (response.success) {
      setSuccessPopup(true);
      setTitle("");
      setDescription("");
    }
  };

  /* ======================================================
     FETCH REPORTS
  ====================================================== */

  const handleFetchReports = async () => {
    await fetchReports(storedUser.email);
    setReportsPopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Flag size={20} />
          Send Report
        </h1>

        <button
          onClick={handleFetchReports}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <ClipboardList size={16} />
          View Reports
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* ======================================================
            FAQ SECTION
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Common Problems & Solutions
          </h2>

          <div className="divide-y">
            {faqData.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-4 text-left text-gray-800 font-medium hover:text-blue-600 transition"
                >
                  {faq.question}

                  {openIndex === index ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {openIndex === index && (
                  <div className="pb-4 text-gray-600 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================
            REPORT FORM
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Still facing a problem? Send us a report
          </h2>

          <div className="space-y-6">
            {/* TITLE */}

            <div>
              <label className="text-sm text-gray-600">Report Title</label>

              <input
                type="text"
                placeholder="Enter issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="text-sm text-gray-600">Description</label>

              <textarea
                rows="5"
                placeholder="Explain your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SUBMIT BUTTON */}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          SUCCESS POPUP
      ====================================================== */}

      {successPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[350px] text-center">
            <h2 className="text-lg font-semibold mb-3">Report Submitted</h2>

            <p className="text-gray-600 text-sm mb-6">
              Your report has been successfully submitted. Our support team will
              review it soon.
            </p>

            <button
              onClick={() => setSuccessPopup(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          REPORT LIST POPUP
      ====================================================== */}

      {reportsPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[700px] max-h-[80vh] overflow-y-auto p-8 relative">
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setReportsPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6">Your Reports</h2>

            {reports.length === 0 ? (
              <p className="text-gray-500">No reports found.</p>
            ) : (
              reports.map((report, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-gray-800">
                      {report.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {report.description}
                  </p>

                  <div className="text-xs text-gray-500">
                    {report.userName} • {report.userEmail}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SendReport;