import React from "react";

const SIPFilters = ({ category, setCategory, risk, setRisk }) => {

  const categories = ["All", "Equity", "Debt", "Hybrid"];
  const risks = ["All", "Low", "Medium", "High"];


  /* CATEGORY TOGGLE */

  const toggleCategory = (item) => {

    if (item === "All") {

      if (category.includes("All")) {
        setCategory([]);
      } else {
        setCategory(["All"]);
      }

      return;

    }

    let updated = category.filter((v) => v !== "All");

    if (updated.includes(item)) {

      updated = updated.filter((v) => v !== item);

    } else {

      updated.push(item);

    }

    /* AUTO SELECT ALL */

    if (updated.length === categories.length - 1) {

      updated = ["All"];

    }

    if (updated.length === 0) {

      updated = ["All"];

    }

    setCategory(updated);

  };


  /* RISK TOGGLE */

  const toggleRisk = (item) => {

    if (item === "All") {

      if (risk.includes("All")) {
        setRisk([]);
      } else {
        setRisk(["All"]);
      }

      return;

    }

    let updated = risk.filter((v) => v !== "All");

    if (updated.includes(item)) {

      updated = updated.filter((v) => v !== item);

    } else {

      updated.push(item);

    }

    /* AUTO SELECT ALL */

    if (updated.length === risks.length - 1) {

      updated = ["All"];

    }

    if (updated.length === 0) {

      updated = ["All"];

    }

    setRisk(updated);

  };


  return (

    <div className="flex flex-col items-end gap-4 w-full">


      {/* CATEGORY */}

      <div className="flex flex-wrap items-center gap-3">

        <span className="text-sm font-semibold text-slate-600 mr-2">
          Category
        </span>

        {categories.map((item) => {

          const active =
            category.includes("All") ||
            category.includes(item);

          return (

            <button
              key={item}
              onClick={() => toggleCategory(item)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              
              ${
                active && item === "Equity"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : active && item === "Debt"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                : active && item === "Hybrid"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                : active && item === "All"
                  ? "bg-slate-200 text-slate-700 border border-slate-300"
                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>

          );

        })}

      </div>



      {/* RISK LEVEL */}

      <div className="flex flex-wrap items-center gap-3">

        <span className="text-sm font-semibold text-slate-600 mr-2">
          Risk Level
        </span>

        {risks.map((item) => {

          const active =
            risk.includes("All") ||
            risk.includes(item);

          return (

            <button
              key={item}
              onClick={() => toggleRisk(item)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              
              ${
                active && item === "Low"
                  ? "bg-green-100 text-green-700 border border-green-200"
                : active && item === "Medium"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : active && item === "High"
                  ? "bg-red-100 text-red-700 border border-red-200"
                : active && item === "All"
                  ? "bg-slate-200 text-slate-700 border border-slate-300"
                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>

          );

        })}

      </div>

    </div>

  );

};

export default SIPFilters;