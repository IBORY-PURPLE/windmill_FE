import StockList from "../components/StockList";
import { useStocks } from "../context/StockContext";

function InterestStock() {
  const { stocks, interestList } = useStocks();

  const interestStocks = stocks.filter((stock) =>
    interestList.includes(stock.id)
  );

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <h1>Interest Stock</h1>
        <StockList
          stocks={interestStocks}
          basePath="/personal/intereststock"
        ></StockList>
      </div>
    </>
  );
}

export default InterestStock;
