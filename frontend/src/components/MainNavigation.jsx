import { NavLink, useRouteLoaderData } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import logoImg from "../assets/logo.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  // hover:bg-[#FFF8E0]
  return (
    <>
      <header className="rounded shadow bg-white-200 max-w-5xl mx-auto pb-4 border-t border-r border-l border-black">
        <div className="flex justify-between items-center mb-2 ">
          <div className="ml-3 mt-3 flex items-center space-x-4 p-2">
            <img src={logoImg} alt="WindMill Logo" className="h-10" />
            <NavLink
              to="/"
              className="text-black text-2xl font-bold hover:underline hover:text-[#C20E2F]"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              WindMill
            </NavLink>
            {token && <LogoutButton></LogoutButton>}
          </div>
        </div>
      </header>
      <nav className="rounded sticky top-0 z-50 bg-gary-200 border border-black hover:bg-[#FFF8E0]">
        {/* <hr className="border-gray-300" /> */}
        <ul className="flex justify-center space-x-6 text-black font-medium text-lg py-2">
          <li>
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-[#C20E2F] pb-1 text-[#C20E2F]"
                  : "hover:underline"
              }
              end
            >
              Home
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/stock"
              className={({ isActive }) =>
                isActive ? "border-b-2 border-white pb-1" : "hover:underline"
              }
            >
              Stock
            </NavLink>
            <ul className="absolute left-0 w-48 bg-white text-black rounded shadow-md hidden group-hover:block z-50">
              <li>
                <NavLink
                  to="/stock/ko_stock"
                  className="block px-4 py-2 mt-1 hover:bg-gray-100"
                >
                  한국 주식
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stock/en_stock"
                  className="block px-4 py-2 mb-1 hover:bg-gray-100"
                >
                  미국 주식
                </NavLink>
              </li>
            </ul>
          </li> */}
          <li className="relative group">
            <NavLink
              to="/news?query=경제"
              className="cursor-pointer hover:underline"
            >
              News
            </NavLink>
            <ul className="absolute left-0 w-48 bg-white text-black rounded shadow-md hidden group-hover:block z-50">
              <li>
                <NavLink
                  to="/news?query=경제"
                  className="block px-4 py-2 mt-1 hover:bg-gray-100"
                >
                  경제
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/news?query=금융"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  금융
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/news?query=S%26P500"
                  className="block px-4 py-2 mb-1 hover:bg-gray-100"
                >
                  S&P500
                </NavLink>
              </li>
            </ul>
          </li>
          {!token && (
            <li>
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  isActive ? "border-b-2 border-white pb-1" : "hover:underline"
                }
                end
              >
                Authentication
              </NavLink>
            </li>
          )}
          {token && (
            <>
              <li className="relative group">
                <NavLink
                  to="/personal"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-white pb-1"
                      : "hover:underline"
                  }
                  end
                >
                  PersonalPage
                </NavLink>
                {/* 드롭다운 메뉴 */}
                <ul className="absolute left-0 w-48 bg-white text-black rounded shadow-md hidden group-hover:block z-50">
                  <li>
                    <NavLink
                      to="/personal/mystock"
                      className="block px-4 py-2 mt-1 hover:bg-gray-100"
                    >
                      MyStock
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/personal/intereststock"
                      className="block px-4 py-2 mb-1 hover:bg-gray-100"
                    >
                      Interest Stock
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink
                  to="/portfolio"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-white pb-1"
                      : "hover:underline"
                  }
                  end
                >
                  PortfolioPage
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
