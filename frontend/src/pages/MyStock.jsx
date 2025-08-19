import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyStocks } from "../api/mystock";
import { useStocks } from "../hooks/useStocks";
import { useAddMyStock } from "../hooks/useAddMystock";
import ErrorBox from "../components/ErrorBox";
import StockList from "../components/StockList";
import AddStockModal from "../components/AddStockModal";
import { useInterestStocks } from "../hooks/useInterestStocks";
import { FiPlus, FiTrendingUp, FiDollarSign, FiPieChart, FiStar } from "react-icons/fi";

function MyStockPage() {
  const { data: stocks = [] } = useStocks();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: interestList = [] } = useInterestStocks();

  const {
    data: myStocks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myStocks"],
    queryFn: fetchMyStocks,
  });

  const addMutation = useAddMyStock();

  const handleAddStock = (data) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        alert("포지션이 추가되었습니다.");
        setModalOpen(false);
      },
      onError: (err) => {
        console.error(err);
        alert("포지션 추가 실패");
      },
    });
  };

  const myStockList = useMemo(() => {
    return myStocks
      .map((my) => {
        const fullStock = stocks.find((s) => s.id === my.stock_id);
        return fullStock
          ? { ...fullStock, ...my, id: fullStock.id, holding_id: my.id }
          : null;
      })
      .filter(Boolean);
  }, [myStocks, stocks]);

  // Calculate portfolio summary
  const portfolioSummary = useMemo(() => {
    if (!myStockList.length) return null;
  
    const totalValue = myStockList.reduce((sum, stock) => {
      // 💡 이 부분에 console.log를 추가합니다.

      // 이전에 제안했던 대로 'price' 필드를 사용합니다.
      const currentPrice = parseFloat(stock.price) || 0;
  
      
      return sum + currentPrice;
    }, 0);
    
    return {
      totalValue,
      stockCount: myStockList.length
    };
  }, [myStockList]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내 주식 포트폴리오</h1>
            <p className="mt-2 text-gray-600">보유 주식 현황을 확인하세요</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-[#C20E2F] text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            <FiPlus className="mr-2" />
            포지션 추가하기
          </button>
        </div>

        {/* Summary Cards */}
        {portfolioSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
         
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                  <FiPieChart size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">보유 종목</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolioSummary.stockCount}개
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">총 평가 금액</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₩{portfolioSummary.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg text-bold font-semibold text-gray-800">보유 종목 목록</h2>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mb-4"></div>
              <p className="text-gray-600">보유 주식 정보를 불러오는 중입니다...</p>
            </div>
          ) : isError ? (
            <ErrorBox
              message={
                error?.message || "보유 주식 정보를 불러오는데 실패했습니다."
              }
            />
          ) : myStockList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">보유 중인 주식이 없습니다.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-[#C20E2F] text-white rounded-md hover:bg-red-700 transition-colors"
              >
                첫 주식 추가하기
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <StockList
                stocks={myStockList}
                basePath="/personal/mystock"
                interestList={interestList}
                showPurchaseInfo={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {modalOpen && (
        <AddStockModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddStock}
        />
      )}
    </div>
  );
}

export default MyStockPage;