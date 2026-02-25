import React from "react";
import { Info, Users, TrendingUp, IndianRupee, CheckCircle, Building } from "lucide-react";

const IPOInvestmentGuide = () => {
  return (
    <section className="mt-16 bg-gradient-to-br from-blue-50 to-white py-16 px-4 md:px-12 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          📌 How IPO Works?
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Understand the basics of IPO investing before applying. A clear
          understanding helps you make smarter investment decisions.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* What is IPO */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <Info className="text-blue-600 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">What is an IPO?</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            IPO (Initial Public Offering) is when a private company offers its
            shares to the public for the first time to raise capital.
          </p>
        </div>

        {/* Retail vs HNI vs QIB */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <Users className="text-green-600 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Retail vs HNI vs QIB</h3>
          <ul className="text-gray-600 text-sm space-y-2">
            <li><strong>Retail:</strong> Up to ₹2 Lakhs</li>
            <li><strong>HNI:</strong> Above ₹2 Lakhs</li>
            <li><strong>QIB:</strong> Mutual Funds & Banks</li>
          </ul>
        </div>

        {/* GMP */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <TrendingUp className="text-purple-600 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">What is GMP?</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Grey Market Premium indicates unofficial demand before listing.
            It gives an idea of expected listing price.
          </p>
        </div>

        {/* Listing Gain */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <IndianRupee className="text-yellow-600 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Listing Gain</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Listing gain is profit earned when stock lists above its IPO issue price.
          </p>
        </div>

        {/* Allotment */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <CheckCircle className="text-red-500 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Allotment Process</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Shares are allotted based on subscription levels. Oversubscription
            leads to lottery system for retail investors.
          </p>
        </div>

        {/* NEW CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border">
          <Building className="text-indigo-600 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">
            Why Companies Launch IPO?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Companies launch IPOs to raise capital for expansion, repay debts,
            improve brand credibility, and allow early investors to exit.
          </p>
        </div>

      </div>

      {/* Risk Box */}
      <div className="mt-12 bg-blue-100 border-l-4 border-blue-500 p-6 rounded-xl">
        <p className="text-sm text-gray-700">
          ⚠ IPO investments are subject to market risks. Always read the
          prospectus carefully before investing.
        </p>
      </div>

    </section>
  );
};

export default IPOInvestmentGuide;
