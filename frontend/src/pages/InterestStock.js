import StockList from "../components/StockList";
import DUMMY_STOCKS from "../data/stocks";

function InterestStock() {
  const intereststocks = DUMMY_STOCKS.filter((stock) => stock.isInterested);

  return (
    <>
      <h1>Interest Stock</h1>
      <StockList stocks={intereststocks}></StockList>
    </>
  );
}

export default InterestStock;
