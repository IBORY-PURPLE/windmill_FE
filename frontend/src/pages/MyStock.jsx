import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyStocks } from "../api/mystock";
import { useStocks } from "../hooks/useStocks";
import { useAddMyStock } from "../hooks/useAddMystock";

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
  console.table(myStockList);

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <h1>My Stock</h1>
        {isLoading ? (
          <p>보유 주식 데이터를 불러오는 중입니다...</p>
        ) : isError ? (
          <p>데이터 로딩 실패</p>
        ) : (
          <StockList
            stocks={myStockList ?? []}
            basePath="/personal/mystock"
            interestList={interestList}
          ></StockList>
        )}

        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + 포지션 추가
          </button>
        </div>
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
