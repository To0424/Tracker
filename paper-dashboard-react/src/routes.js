import Dashboard from "views/Dashboard.js";
import History from "views/History.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-bar-32",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/history",
    name: "History",
    icon: "nc-icon nc-zoom-split",
    component: <History />,
    layout: "/admin",
  },
];
export default routes;
