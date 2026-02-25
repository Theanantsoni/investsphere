import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";

const SIPDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const navSectionRef = useRef(null);

  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // ================= DATE FILTER STATES =================
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);

  const [startDate, setStartDate] = useState(
    fiveYearsAgo.toISOString().split("T")[0]
  );

  const [endDate, setEndDate] = useState(
    yesterday.toISOString().split("T")[0]
  );

  // ================= SIP STATES =================
  const [monthly, setMonthly] = useState(15000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  // ================= SIP CALCULATION =================
  const futureValue = useMemo(() => {
    if (!monthly || !years) return 0;

    const n = years * 12;
    if (rate === 0) return monthly * n;

    const r = rate / 100 / 12;
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return Math.round(fv);
  }, [monthly, rate, years]);

  const totalInvested = monthly * years * 12;
  const estimatedGain = futureValue - totalInvested;

  // ================= FETCH FUND =================
  useEffect(() => {
    if (!id) {
      setError("Invalid Fund Code");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/sip/${id}`);
        setFund(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch fund details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // ================= RESET PAGE WHEN FILTER CHANGES =================
  useEffect(() => {
    setCurrentPage(1);
  }, [id, startDate, endDate]);

// ================= FILTER DATA =================
const filteredData = useMemo(() => {
  if (!fund?.data) return [];

  return fund.data
    .filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate >= new Date(startDate) &&
        itemDate <= new Date(endDate)
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); 
}, [fund, startDate, endDate]);

  // ================= PAGINATION =================
  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);

  const latestNav = fund?.data?.[0];

  // ================= RETURNS =================
  const returns = useMemo(() => {
    if (!fund?.data?.length) return {};

    const calculateReturn = (yrs) => {
      const targetDate = new Date();
      targetDate.setFullYear(targetDate.getFullYear() - yrs);

      const pastEntry = fund.data.find(
        (item) => new Date(item.date) <= targetDate
      );

      if (!pastEntry) return "N/A";

      const latest = parseFloat(fund.data[0].nav);
      const past = parseFloat(pastEntry.nav);

      const percent = ((latest - past) / past) * 100;
      return percent.toFixed(2) + "%";
    };

    return {
      oneYear: calculateReturn(1),
      threeYear: calculateReturn(3),
      fiveYear: calculateReturn(5),
    };
  }, [fund]);

  // ================= TABLE DATA =================
  const enhancedData = currentData?.map((item, index) => {
  const currentNav = parseFloat(item.nav);
  const prevItem = currentData[index + 1];

    let change = 0;
    let changePercent = 0;

    if (prevItem) {
      const prevNav = parseFloat(prevItem.nav);
      change = currentNav - prevNav;
      changePercent = (change / prevNav) * 100;
    }

    let level = "MID";
    if (change > 0) level = "UP";
    if (change < 0) level = "DOWN";

    return {
      ...item,
      change,
      changePercent,
      level,
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading fund details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ================= RISK LEVEL =================
const getRiskLevel = () => {
  const type = fund?.meta?.scheme_type?.toLowerCase() || "";

  if (type.includes("equity")) return "High Risk";
  if (type.includes("debt")) return "Low Risk";

  return "Moderate Risk";
};



  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HERO */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {fund?.meta?.scheme_name}
          </h1>
          <p className="text-slate-500 mt-2">
            Scheme Code: {fund?.meta?.scheme_code}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Badge label={fund?.meta?.scheme_type} />
            <Badge label={fund?.meta?.scheme_category} />
            <Badge label={fund?.meta?.fund_house} />
          </div>

          <div className="mt-6">
            <p className="text-slate-500 text-sm">Latest NAV</p>
            <p className="text-3xl font-semibold text-green-600">
              ₹{latestNav?.nav}
            </p>
            <p className="text-xs text-slate-400">
              Updated on {latestNav?.date}
            </p>
          </div>
        </div>

        {/* FUND OVERVIEW */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Fund Overview</h2>

          <p className="text-slate-600 leading-relaxed">
            {fund?.meta?.scheme_name} is a {fund?.meta?.scheme_category} scheme
            offered by {fund?.meta?.fund_house}. This fund aims to generate
            long-term capital growth using disciplined investment strategies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Info label="Fund House" value={fund?.meta?.fund_house} />
            <Info label="Scheme Type" value={fund?.meta?.scheme_type} />
            <Info label="Scheme Category" value={fund?.meta?.scheme_category} />
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Performance Snapshot</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Metric title="1 Year Return" value={returns.oneYear} />
            <Metric title="3 Year Return" value={returns.threeYear} />
            <Metric title="5 Year Return" value={returns.fiveYear} />
          </div>
        </div>

        {/* FUND DETAILS */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">
            Fund Management & Risk Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-semibold text-slate-700 mb-3">
                Fund Manager
              </h3>
              <p className="text-slate-600">
                Managed by professionals at{" "}
                <span className="font-medium">{fund?.meta?.fund_house}</span>.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-semibold text-slate-700 mb-3">Risk Level</h3>
              <span className="text-sm font-medium text-yellow-600">
                {getRiskLevel()}
              </span>
            </div>
          </div>
        </div>

        {/* NAV TABLE */}
        <div ref={navSectionRef} className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">NAV History</h2>

          {/* DATE FILTER UI */}
          <div className="mb-6 bg-slate-50 p-4 rounded-xl flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="text-sm text-slate-500">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={fiveYearsAgo.toISOString().split("T")[0]}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={yesterday.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded-lg mt-1"
                />
              </div>
            </div>

            <div className="text-sm text-slate-500">
              Showing {totalRows} records
            </div>
          </div>

          {totalRows === 0 && (
            <p className="text-center text-slate-500 py-6">
              No data available for selected date range.
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3">Date</th>
                  <th className="py-3">NAV</th>
                  <th className="py-3">Change</th>
                  <th className="py-3">% Change</th>
                  <th className="py-3 text-center">Level</th>
                </tr>
              </thead>

              <tbody>
                {enhancedData?.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-3">{item.date}</td>
                    <td className="py-3 font-medium">₹{item.nav}</td>

                    <td className={`py-3 font-medium ${
                      item.change > 0
                        ? "text-green-600"
                        : item.change < 0
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}>
                      {item.change.toFixed(2)}
                    </td>

                    <td className={`py-3 ${
                      item.changePercent > 0
                        ? "text-green-600"
                        : item.changePercent < 0
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}>
                      {item.changePercent.toFixed(2)}%
                    </td>

                    <td className="py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.level === "UP"
                          ? "bg-green-100 text-green-700"
                          : item.level === "DOWN"
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalRows > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border text-sm"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) => page >= currentPage - 2 && page <= currentPage + 2
                )
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg text-sm ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* SIP CALCULATOR */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">
            SIP Investment Projection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Monthly Investment (₹)"
              value={monthly}
              onChange={setMonthly}
            />
            <InputField
              label="Expected Return (%)"
              value={rate}
              onChange={setRate}
            />
            <InputField
              label="Duration (Years)"
              value={years}
              onChange={setYears}
            />
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-sm text-slate-500">Estimated Future Value</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ₹ {futureValue.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Total Invested</p>
              <p className="font-semibold text-slate-800">
                ₹ {totalInvested.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Estimated Gain</p>
              <p className="font-semibold text-green-600">
                ₹ {estimatedGain.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== REUSABLE COMPONENTS =====================

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-slate-500">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-medium text-slate-800">{value || "N/A"}</p>
  </div>
);

const Metric = ({ title, value }) => {
  const isNegative = value?.includes("-");
  return (
    <div className="bg-slate-50 p-6 rounded-xl text-center">
      <p className="text-sm text-slate-500">{title}</p>
      <p
        className={`text-xl font-semibold mt-2 ${
          isNegative ? "text-red-500" : "text-green-600"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
};

const Badge = ({ label }) => (
  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
    {label}
  </span>
);

export default SIPDetailPage;
