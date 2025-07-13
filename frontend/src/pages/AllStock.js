import StockList from "../components/StockList";
import DUMMY_STOCKS from "../data/stocks";
import Pagination from "../components/Pagination";
import { useRouteLoaderData } from "react-router-dom";

const page = 1;
const totalPages = 10;
function AllStockPage() {
  // const { stocks, page, totalPages } = useRouteLoaderData("allstock");
  return (
    <>
      <h1>All Stock</h1>
      <StockList stocks={DUMMY_STOCKS}></StockList>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

export default AllStockPage;
