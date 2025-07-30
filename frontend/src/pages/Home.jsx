import { useStocks } from "../hooks/useStocks";
import { useInterestStocks } from "../hooks/useInterestStocks";
import StockSection from "../components/StockSection";
import { useLocation } from "react-router-dom";
import Pagination from "../util/Pagination";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useNews } from "../hooks/useNews";

function HomePage() {
  const { token } = useAuth();
  const { data: stocks = [], isLoading: stocksLoading } = useStocks({
    staleTime: 1000 * 60 * 5,
  });
  const { data: interestList = [], isLoading: interestLoading } =
    useInterestStocks({
      enabled: !!token,
    });

  const { data: economyNews = [] } = useNews("경제");
  const { data: financeNews = [] } = useNews("금융");
  const { data: sp500News = [] } = useNews("S&P500");

  const safe = (arr) => (Array.isArray(arr) ? arr : []);

  const combinedNews = [
    ...safe(economyNews)
      .slice(0, 3)
      .map((n) => ({ ...n, category: "경제" })),
    ...safe(financeNews)
      .slice(0, 3)
      .map((n) => ({ ...n, category: "금융" })),
    ...safe(sp500News)
      .slice(0, 3)
      .map((n) => ({ ...n, category: "S&P500" })),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const size = 50;

  const totalPages = Math.ceil(stocks.length / size);
  const paginatedStocks = stocks.slice((page - 1) * size, page * size);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const fetchSearchResults = async () => {
  //     if (searchTerm.trim() === "") {
  //       setSearchResults(null);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `https://windmill-be-iqxx.onrender.com/stock/search?search=${searchTerm}`,
  //         { signal: controller.signal }
  //       );
  //       const data = await response.json();
  //       setSearchResults(data.data);
  //     } catch (err) {
  //       if (err.name !== "AbortError") console.error(err);
  //     }
  //   };

  //   const debounce = setTimeout(fetchSearchResults, 300);
  //   return () => {
  //     clearTimeout(debounce);
  //     controller.abort();
  //   };
  // }, [searchTerm]);

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
  if (isLoggedIn) {
    if (stocksLoading || interestLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold text-gray-600">
            전체 종목을 불러오는 중입니다.
          </p>
        </div>
      );
    }
  } else {
    if (stocksLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold text-gray-600">
            Loading 전체종목...
          </p>
        </div>
      );
    }
  }

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (combinedNews.length === 0) return;
  //     setCurrentIndex((prev) => (prev + 1) % combinedNews.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [combinedNews.length]);
  // useEffect(() => {
  //   if (combinedNews.length > 0) {
  //     const timer = setInterval(() => {
  //       setCurrentIndex((prev) => (prev + 1) % combinedNews.length);
  //     }, 2500);
  //     return () => clearInterval(timer);
  //   }
  // }, [combinedNews.length]);

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case "경제":
        return "bg-green-500";
      case "금융":
        return "bg-yellow-500";
      case "S&P500":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex gap-4 mb-6">
          {/* 뉴스 박스 */}
          <div className="flex-1 bg-red-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2 text-red-600">
              📢 오늘의 뉴스
            </h2>
            <div className="flex overflow-hidden h-24 rounded-lg border bg-white">
              {combinedNews.length > 0 ? (
                <div
                  key={currentIndex}
                  className="flex-shrink-0 w-full p-4 transition-opacity duration-500"
                >
                  {/* 카테고리 뱃지 */}
                  <span
                    className={`inline-block text-xs mr-1 text-white px-2 py-1 rounded-full mb-1 ${getCategoryBadgeColor(
                      combinedNews[currentIndex].category
                    )}`}
                  >
                    {combinedNews[currentIndex].category}
                  </span>
                  <a
                    href={combinedNews[currentIndex].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline text-gray-900"
                  >
                    {combinedNews[currentIndex].title}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    {combinedNews[currentIndex].pubDate}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 p-4">
                  뉴스를 불러오는 중...
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green-100 p-4 mb-4 rounded-lg shadow-md">
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

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-64 focus:outline-none focus:ring focus:border-blue-400"
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
