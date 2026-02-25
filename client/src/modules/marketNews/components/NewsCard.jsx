import { CalendarDays, ExternalLink } from "lucide-react";

const NewsCard = ({ item }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">

      {/* Image */}
      {item.image && (
        <div className="overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      )}

      <div className="p-5 flex flex-col justify-between h-64">

        <div>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
            {item.title}
          </h3>

          <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
            <CalendarDays size={14} />
            {new Date(item.publishedAt).toLocaleDateString()}
          </div>

          <p className="text-sm text-gray-600 mt-3 line-clamp-3">
            {item.description}
          </p>
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
        >
          Read Full Article
          <ExternalLink size={14} />
        </a>

      </div>
    </div>
  );
};

export default NewsCard;