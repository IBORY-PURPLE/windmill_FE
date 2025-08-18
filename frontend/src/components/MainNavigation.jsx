import { NavLink, useRouteLoaderData, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import logoImg from "../assets/windmill.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <>
      <header className="block bg-white shadow-md transition-transform duration-300 max-w-5xl mx-auto">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <NavLink 
                to="/" 
                className="flex-shrink-0 flex items-center"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img 
                  className="h-10 w-auto" 
                  src={logoImg} 
                  alt="WindMill" 
                />
                <span className="ml-2 text-4xl font-bold text-[#324D60]">
                  WindMill
                </span>
              </NavLink>

          {token? (<LogoutButton></LogoutButton>):(<NavLink
              to="/auth?mode=login"
              className="ml-2 px-3 py-1.5 rounded-lg font-medium text-white bg-[#C20E2F] hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">🔑</span>
              로그인
            </NavLink>)}
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white rounded sticky top-0 z-50">
        <ul className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center space-x-1">
          <NavLink
            to="/"
            className={({ isActive }) => `
              px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                isActive 
                  ? 'text-[#C20E2F] bg-[rgba(194,14,47,0.05)]' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            end
          >
            <span className="hidden md:block mr-2">🏠</span>
            홈
          </NavLink>
          
          <div className="relative group">
            <button className="px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center transition-colors duration-200">
              <span className="hidden md:block mr-2">📰</span>
              <span>뉴스</span>
            </button>
            <div className="absolute left-0 mt-1 w-48 rounded-lg shadow-xl bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
              <div className="py-1">
                <NavLink
                  to="/news?query=경제"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="mr-2">💰</span>
                  경제
                </NavLink>
                <NavLink
                  to="/news?query=암호화폐"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="mr-2">🪙</span>
                  암호화폐
                </NavLink>
                <NavLink
                  to="/news?query=주식시장"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="mr-2">📈</span>
                  주식시장
                </NavLink>
                <NavLink
                  to="/news?query=정치"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="mr-2">🏛️</span>
                  정치
                </NavLink>
              </div>
            </div>
          </div>

          {token && (<>
            <div className="relative group">
              <NavLink
                to="/personal"
                className={({ isActive }) => `
                  px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <span className="hidden md:block mr-2">👤</span>
                내 정보
              </NavLink>
              <div className="absolute left-0 mt-1 w-48 rounded-lg shadow-xl bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
                <div className="py-1">
                  <NavLink
                    to="/personal/mystock"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="mr-2">💼</span>
                    내 주식
                  </NavLink>
                  <NavLink
                    to="/personal/intereststock"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="mr-2">⭐</span>
                    관심 주식
                  </NavLink>
                </div>
              </div>
            </div>
            <div><NavLink
              to="/portfolio"
              className={({ isActive }) => `
                px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <span className="hidden md:block mr-2">📊</span>
              포트폴리오
              </NavLink></div>
            </>
          )}

          </div>
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;