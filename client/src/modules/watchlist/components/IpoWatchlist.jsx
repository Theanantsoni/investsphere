import { Trash2 } from "lucide-react";

const IpoWatchlist = ({ data, removeWatchlist }) => {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-20">No IPOs in Watchlist</p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data.map((ipo) => (
        <div
          key={ipo._id}
          className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl transition flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg">{ipo.itemName}</p>

            <p className="text-gray-400 text-sm">Symbol: {ipo.itemCode}</p>
          </div>

          <button
            onClick={() => removeWatchlist(ipo.itemCode)}
            className="text-red-500 flex items-center gap-2 hover:text-red-600"
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default IpoWatchlist;
