import StockList from "../components/StockList";
import { useStocks } from "../hooks/useStocks";
import { useInterestStocks } from "../hooks/useInterestStocks";
import { useMemo } from "react";

function InterestStockPage() {
  const { data: stocks = [] } = useStocks();
  const { data: interestList = [], isLoading, isError } = useInterestStocks();

  const interestStocks = useMemo(() => {
    return stocks.filter((stock) => interestList.includes(stock.id));
  }, [stocks, interestList]);

  if (isLoading) return <p>관심 종목을 불러오는 중입니다...</p>;
  if (isError) return <p>데이터 로딩 실패</p>;

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <h1>Interest Stock</h1>
        <StockList
          stocks={interestStocks}
          basePath="/personal/intereststock"
          interestList={interestList}
        ></StockList>
      </div>
    </>
  );
}

export default InterestStockPage;
