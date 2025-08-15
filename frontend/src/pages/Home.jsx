import { useStocks } from "../hooks/useStocks";
import { useInterestStocks } from "../hooks/useInterestStocks";
import StockSection from "../components/StockSection";
import { useLocation } from "react-router-dom";
import Pagination from "../util/Pagination";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import NewsSection from "../components/NewsSection";

function HomePage() {
  const { token } = useAuth();

  const { data: stocks = [], isLoading: stocksLoading } = useStocks({
    staleTime: 1000 * 60 * 5,
  });
  const { data: interestList = [], isLoading: interestLoading } =
    useInterestStocks({
      enabled: !!token,
    });

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const size = 50;

  const totalPages = Math.ceil(stocks.length / size);
  const paginatedStocks = stocks.slice((page - 1) * size, page * size);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults(null);
      return;
    }

    const filtered = stocks.filter(
      (s) =>
        s.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        s.ticker.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchTerm, stocks]);

  const displayedStocks = searchResults ?? paginatedStocks;

  const isLoggedIn = !!token;
  const isLoading = isLoggedIn
    ? stocksLoading || interestLoading
    : stocksLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 justify-center items-center h-screen">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breaking News Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">BREAKING</span>
            <p className="ml-3 text-sm font-medium text-gray-800">최신 시장 소식을 확인하세요</p>
          </div>
        </div>

        {/* Main News Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">📰 주요 시장 뉴스</h2>
          </div>
          <NewsSection />
        </section>

        {/* Market Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">코스피</h3>
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">KOREA</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">2,710.56</span>
              <span className="ml-2 text-sm font-medium text-green-500">+0.78%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">전일 대비 +21.45</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">나스닥</h3>
              <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">US</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">15,823.34</span>
              <span className="ml-2 text-sm font-medium text-red-500">-0.23%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">전일 대비 -36.42</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">S&P 500</h3>
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">US</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">5,456.12</span>
              <span className="ml-2 text-sm font-medium text-green-500">+0.12%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">전일 대비 +6.54</p>
          </div>
        </section>
        <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Search</h1>
            </div>
            <div className="flex-1 max-w-2xl mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="종목명 또는 티커 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
                <svg
                  className="absolute right-4 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Stock List */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">📊 주요 종목</h2>
          </div>
          <StockSection stocks={displayedStocks} interestList={interestList} />
          {!searchResults && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
