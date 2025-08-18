import { NavLink } from "react-router-dom";

function PersonalNavigation() {
  // const location = useLocation();
  // const basePath = "/personal";

  // const query = new URLSearchParams(location.search);
  // const currentFilter = query.get("filter") || "all";

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-8">
          <NavLink
            to="/personal/mystock"
            className={({ isActive }) => `
              py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                isActive 
                  ? 'border-[#C20E2F] text-[#C20E2F]' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            내 주식
          </NavLink>
          <NavLink
            to="/personal/intereststock"
            className={({ isActive }) => `
              py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                isActive 
                  ? 'border-[#C20E2F] text-[#C20E2F]' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            관심 주식
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default PersonalNavigation;
