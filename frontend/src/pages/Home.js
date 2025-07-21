import { useStocks } from "../context/StockContext";
import StockSection from "../components/StockSection";
import { useLocation } from "react-router-dom";
import Pagination from "../util/Pagination";
import { useEffect, useState } from "react";

function HomePage() {
  const { stocks, isLoading } = useStocks();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const size = 50;

  const totalPages = Math.ceil(stocks.length / size);
  const paginatedStocks = stocks.slice((page - 1) * size, page * size);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults(null);
        return;
      }

      try {
        const response = await fetch(
          `https://windmill-be-iqxx.onrender.com/stock/search?search=${searchTerm}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setSearchResults(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchTerm]);

  const displayedStocks = searchResults ?? paginatedStocks;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          Loading 관심종목...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex gap-4 mb-6">
          {/* 뉴스 박스 */}
          <div className="flex-1 bg-red-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2 text-red-600">
              📢 오늘의 뉴스
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>삼성전자 2분기 실적 호조</li>
              <li>미국 금리 동결 발표</li>
              <li>AI 기술주 상승세 지속</li>
            </ul>
          </div>

          {/* 지수 박스 */}
          <div className="flex-1 bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2 text-green-600">
              📈 주요 지수
            </h2>
            <ul className="text-sm text-gray-800">
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
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-64 focus:outline-none focus:ring focus:border-blue-400"
          ></input>
        </div>
        <StockSection stocks={displayedStocks} isLoading={isLoading} />
        {!searchResults && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}

export default HomePage;
