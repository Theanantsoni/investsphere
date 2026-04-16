// src/components/StatsCard.jsx

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>

          {trend && (
            <p
              className={`text-xs mt-2 ${
                trend > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`p-3 rounded-xl bg-${color}-600/20 text-${color}-400`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;