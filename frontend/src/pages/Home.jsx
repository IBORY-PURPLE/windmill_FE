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
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          종목 정보를 불러오는 중입니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex gap-4 mb-6">
          <NewsSection />
        </div>
        <div className="flex-1 bg-white p-4 mb-4 rounded-lg shadow-md border border-black">
          <h2 className="text-lg font-bold mb-2 ml-2 text-black hover:text-[#C20E2F]">
            주요 지수
          </h2>
          <ul className="text-sm text-gray-800 border border-black">
            <li>
              KOSPI: 2,710.56 <span className="text-green-600">+0.78%</span>
            </li>
            <li>
              NASDAQ: 15,823.34 <span className="text-red-500">-0.23%</span>
            </li>
            <li>
              S&P 500: 5,456.12 <span className="text-green-600">+0.12%</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-black rounded px-3 py-1 w-64 focus:outline-none focus:ring bg-white"
          ></input>
        </div>
        <StockSection stocks={displayedStocks} interestList={interestList} />
        {!searchResults && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}

export default HomePage;
