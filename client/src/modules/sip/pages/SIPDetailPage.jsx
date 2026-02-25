import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SIPDetailPage = () => {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState(5000);
  const [years, setYears] = useState(5);
  const [returnRate, setReturnRate] = useState(12);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/sip/${id}`);
        setFund(res.data.meta);

        setNavHistory(
          res.data.data.slice(0, 20).reverse().map((item) => ({
            date: item.date,
            nav: parseFloat(item.nav),
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-slate-500 mt-20">
        Loading...
      </div>
    );

  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;

  const futureValue =
    amount *
    (((1 + monthlyRate) ** months - 1) / monthlyRate) *
    (1 + monthlyRate);

  const totalInvested = amount * months;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      
      {/* Fund Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          {fund.scheme_name}
        </h1>

        <p className="text-slate-500 mt-1">
          Scheme Code: {fund.scheme_code}
        </p>

        <p className="mt-3 text-green-600 font-semibold">
          Latest NAV: ₹{navHistory.at(-1)?.nav}
        </p>
      </div>

      {/* NAV Chart Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          NAV Performance
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={navHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="nav"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SIP Calculator */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          SIP Calculator
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            placeholder="Monthly Investment"
            className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            placeholder="Years"
            className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="number"
            value={returnRate}
            onChange={(e) => setReturnRate(+e.target.value)}
            placeholder="Expected Return %"
            className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          
          <div className="bg-slate-100 p-4 rounded-xl">
            <p className="text-slate-500">Total Invested</p>
            <p className="text-lg font-bold text-slate-800">
              ₹{totalInvested.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl">
            <p className="text-slate-500">Estimated Returns</p>
            <p className="text-lg font-bold text-green-600">
              ₹{(futureValue - totalInvested).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl">
            <p className="text-slate-500">Future Value</p>
            <p className="text-lg font-bold text-green-700">
              ₹{futureValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPDetailPage;