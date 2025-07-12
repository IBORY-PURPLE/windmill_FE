import StockList from "../components/StockList";
import DUMMY_STOCKS from "../data/stocks";

function MyStock() {
  const mystocks = DUMMY_STOCKS.filter((stock) => stock.isMine);

  return (
    <>
      <h1>My Stock</h1>
      <StockList stocks={mystocks}></StockList>
    </>
  );
}

export default MyStock;
