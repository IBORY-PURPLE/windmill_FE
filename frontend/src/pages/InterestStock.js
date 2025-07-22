import StockList from "../components/StockList";
import { useStocks } from "../context/StockContext";
import { useMemo } from "react";

function InterestStockPage() {
  const { stocks, interestList } = useStocks();

  const interestStocks = useMemo(() => {
    return stocks.filter((stock) => interestList.includes(stock.id));
  }, [stocks, interestList]);

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

export default InterestStockPage;
