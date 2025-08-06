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

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center items-center mt-20">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
  //     </div>
  //   );
  // if (isError)
  //   return (
  //     <ErrorBox
  //       message={error?.message || "관심 종목 정보를 불러오는 데 실패했습니다."}
  //     />
  //   );

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4 border border-black rounded h-screen">
        <h1>Interest Stock</h1>
        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
          </div>
        ) : isError ? (
          <ErrorBox
            message={
              error?.message || "관심 종목 정보를 불러오는 데 실패했습니다."
            }
          />
        ) : (
          <StockList
            stocks={interestStocks}
            basePath="/personal/intereststock"
            interestList={interestList}
          ></StockList>
        )}
      </div>
    </>
  );
}

export default InterestStockPage;
