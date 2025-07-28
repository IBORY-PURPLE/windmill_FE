import StockList from "../components/StockList";
import { useStocks } from "../hooks/useStocks";
import { useInterestStocks } from "../hooks/useInterestStocks";
import { useMemo } from "react";
import ErrorBox from "../components/ErrorBox";

function InterestStockPage() {
  const { data: stocks = [] } = useStocks();
  const {
    data: interestList = [],
    isLoading,
    isError,
    error,
  } = useInterestStocks();

  const interestStocks = useMemo(() => {
    return stocks.filter((stock) => interestList.includes(stock.id));
  }, [stocks, interestList]);

  if (isLoading) return <p>관심 종목을 불러오는 중입니다...</p>;
  if (isError)
    return (
      <ErrorBox
        message={error?.message || "관심 종목 정보를 불러오는 데 실패했습니다."}
      />
    );

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
