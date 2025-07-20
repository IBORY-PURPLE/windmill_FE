import StockList from "../components/StockList";
import { useStocks } from "../context/StockContext";

function InterestStock() {
  const { stocks, interestList } = useStocks();

  const interestStocks = stocks.filter((stock) =>
    interestList.includes(stock.id)
  );

  return (
    <>
      <h1>Interest Stock</h1>
      <StockList
        stocks={interestStocks}
        basePath="/personal/intereststock"
      ></StockList>
    </>
  );
}

export default InterestStock;
