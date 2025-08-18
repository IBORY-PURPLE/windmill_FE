import { useState, useMemo } from "react";
import { useStocks } from "../hooks/useStocks";
import { useInterestStocks } from "../hooks/useInterestStocks";
import ErrorBox from "../components/ErrorBox";
import StockList from "../components/StockList";
import { FiStar, FiPieChart, FiPlus } from "react-icons/fi";

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

  // Calculate interest stocks summary
  const interestSummary = useMemo(() => {
    if (!interestStocks.length) return null;
    
    const totalValue = interestStocks.reduce((sum, stock) => {
      return sum + (stock.price || 0);
    }, 0);
    
    return {
      totalValue,
      stockCount: interestStocks.length
    };
  }, [interestStocks]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관심 종목</h1>
            <p className="mt-2 text-gray-600">관심 종목 현황을 확인하세요</p>
          </div>
        </div>

        {/* Summary Cards */}
        {interestSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                  <FiStar size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">관심 종목 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {interestSummary.stockCount}개
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                  <FiPieChart size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">총 평가 금액</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₩{interestSummary.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">관심 종목 목록</h2>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mb-4"></div>
              <p className="text-gray-600">관심 종목을 불러오는 중입니다...</p>
            </div>
          ) : isError ? (
            <ErrorBox
              message={
                error?.message || "관심 종목 정보를 불러오는 데 실패했습니다."
              }
            />
          ) : interestStocks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">관심 종목이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <StockList
                stocks={interestStocks}
                basePath="/personal/intereststock"
                interestList={interestList}
                showPurchaseInfo={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterestStockPage;
