import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyStocks } from "../api/mystock";
import { useStocks } from "../hooks/useStocks";
import { useAddMyStock } from "../hooks/useAddMystock";
import ErrorBox from "../components/ErrorBox";
import StockList from "../components/StockList";
import AddStockModal from "../components/AddStockModal";
import { useInterestStocks } from "../hooks/useInterestStocks";

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

  return (
    <div className="bg-gray-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto bg-gray-800 rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">My Stock</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105 shadow-md"
          >
            + 포지션 추가
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : isError ? (
          <ErrorBox
            message={
              error?.message || "보유 주식 정보를 불러오는데 실패했습니다."
            }
          />
        ) : (
          <div className="space-y-6">
            <StockList
              stocks={myStockList ?? []}
              basePath="/personal/mystock"
              interestList={interestList}
            ></StockList>
          </div>
        )}
      </div>

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