import SIPPage from "./pages/SIPPage";
import SIPDetailPage from "./pages/SIPDetailPage";

const sipRoutes = [
  {
    path: "/sip",
    element: <SIPPage />,
  },
  {
    path: "/sip/:id",
    element: <SIPDetailPage />,
  },
];

export default sipRoutes;