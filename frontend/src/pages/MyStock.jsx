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

  // mystoks_db와 allstock_db의 필드들을 합친 데이터 생성.
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
  console.table(myStockList);

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4 border border-black rounded h-screen">
        <h1>My Stock</h1>
        <div>
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="border border-black bg-gray-200 text-gray-900 px-6 py-2 rounded no-underline transition-colors duration-200 hover:bg-[#C20E2F] hover:text-white mb-4"
          >
            + 포지션 추가
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
          </div>
        ) : isError ? (
          <ErrorBox
            message={
              error?.message || "보유 주식 정보를 불러오는데 실패했습니다."
            }
          />
        ) : (
          <StockList
            stocks={myStockList ?? []}
            basePath="/personal/mystock"
            interestList={interestList}
          ></StockList>
        )}

        {modalOpen && (
          <AddStockModal
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddStock}
          />
        )}
      </div>
    </>
  );
}

export default MyStockPage;
