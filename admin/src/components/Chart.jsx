// src/components/Chart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Chart = ({ data = [], dataKey = "value", xKey = "name" }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-80">
      <h3 className="text-sm text-gray-400 mb-4">Analytics</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey={xKey} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;