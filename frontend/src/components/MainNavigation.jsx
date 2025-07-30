import { NavLink, useRouteLoaderData } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import logoImg from "../assets/logo.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="sticky top-0 z-50  shadow bg-[#004e96] max-w-5xl mx-auto p-4">
      <nav>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <img src={logoImg} alt="WindMill Logo" className="h-10" />
            <NavLink
              to="/"
              className="text-white text-2xl font-bold hover:underline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              WindMill
            </NavLink>
          </div>
        </div>
        <hr className="border-gray-300 mb-4" />
        <ul className="flex justify-center space-x-6 text-white font-medium text-lg">
          <li>
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                isActive ? "border-b-2 border-white pb-1" : "hover:underline"
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
            <li className="relative group">
              <NavLink
                to="/personal"
                className={({ isActive }) =>
                  isActive ? "border-b-2 border-white pb-1" : "hover:underline"
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
          )}
          {token && (
            <li>
              <LogoutButton></LogoutButton>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
