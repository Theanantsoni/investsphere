import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./shared/layout/MainLayout";

import HomePage from "./pages/HomePage";

// IPO Pages
import IPOPage from "./modules/ipo/pages/IPOPage";
import IPOApplicationProcessPage from "./modules/ipo/pages/IPOApplicationProcessPage";
import IPOApplyPage from "./modules/ipo/pages/IPOApplyPage";

// SIP Pages
import SIPPage from "./modules/sip/pages/SIPPage";
import SIPDetailPage from "./modules/sip/pages/SIPDetailPage";
import SIPPlannerPage from "./modules/sip/pages/SIPPlannerPage";

// Market News Page
import MarketNewsPage from "./modules/marketNews/pages/MarketNewsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Home */}
          <Route index element={<HomePage />} />

          {/* IPO Routes */}
          <Route path="ipo" element={<IPOPage />} />
          <Route
            path="ipo/application-process"
            element={<IPOApplicationProcessPage />}
          />

          {/* ✅ SIP Nested Routes */}
          <Route path="sip">
            <Route index element={<SIPPage />} />
            <Route path="planner" element={<SIPPlannerPage />} /> {/* ✅ NEW */}
            <Route path=":id" element={<SIPDetailPage />} />
          </Route>

          {/* Market News */}
          <Route path="/market-news" element={<MarketNewsPage />} />

        </Route>

        {/* Outside Layout Routes */}
        <Route path="ipo/apply/:symbol" element={<IPOApplyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;