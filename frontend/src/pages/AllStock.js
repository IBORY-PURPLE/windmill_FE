import StockList from "../components/StockList";
import DUMMY_STOCKS from "../data/stocks";

function AllStockPage() {
  return (
    <>
      <h1>All Stock</h1>
      <StockList stocks={DUMMY_STOCKS}></StockList>
    </>
  );
}

export default AllStockPage;
