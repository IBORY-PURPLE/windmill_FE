import { useStocks } from "../context/StockContext";
import StockSection from "../components/StockSection";
import { useLocation } from "react-router-dom";
import Pagination from "../util/Pagination";
import { useEffect, useState } from "react";

function HomePage() {
  const { stocks } = useStocks();
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
  return (
    <>
      <div className="h-40 bg-gray-100">News</div>
      <div className="p-4">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-64 focus:outline-none focus:ring focus:border-blue-400"
          ></input>
        </div>
        <StockSection stocks={displayedStocks} />
        {!searchResults && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}

export default HomePage;
