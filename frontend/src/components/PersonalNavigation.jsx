import { NavLink } from "react-router-dom";

function PersonalNavigation() {
  // const location = useLocation();
  // const basePath = "/personal";

  // const query = new URLSearchParams(location.search);
  // const currentFilter = query.get("filter") || "all";

  return (
    <header className="p-8 flex justify-center">
      <nav>
        <ul className="flex gap-4">
          <li>
            <NavLink
              to="/personal/mystock"
              className={({ isActive }) =>
                `border border-black ${
                  isActive
                    ? "bg-[#C20E2F] text-white"
                    : "bg-gray-200 text-gray-900"
                } px-6 py-2 rounded no-underline transition-colors duration-200 hover:bg-[#C20E2F] hover:text-white`
              }
            >
              Mystock
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/personal/intereststock"
              className={({ isActive }) =>
                `border border-black ${
                  isActive
                    ? "bg-[#C20E2F] text-white"
                    : "bg-gray-200 text-gray-900"
                } px-6 py-2 rounded no-underline transition-colors duration-200 hover:bg-[#C20E2F] hover:text-white`
              }
            >
              Interest Stock
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default PersonalNavigation;
