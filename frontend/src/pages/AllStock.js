import StockList from "../components/StockList";
// import DUMMY_STOCKS from "../data/stocks";
import Pagination from "../util/Pagination";
import { useRouteLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

function AllStockPage() {
  const { stocks, page, totalPages } = useRouteLoaderData("allstock");
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

  const displayedStocks = searchResults ?? stocks;
  return (
    <>
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-64 focus:outline-none focus:ring focus:border-blue-400"
          ></input>
        </div>
        <h1>All Stock</h1>
        <StockList stocks={displayedStocks}></StockList>
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </>
  );
}

export default AllStockPage;
