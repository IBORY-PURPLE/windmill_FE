import StockList from "../components/StockList";
// import DUMMY_STOCKS from "../data/stocks";
import { useStocks } from "../context/StockContext";
import { useState } from "react";
import AddStockModal from "../components/AddStockModal";

function MyStock() {
  const [modalOpen, setModalOpen] = useState(false);
  const { stocks } = useStocks();

  // const mystocks = DUMMY_STOCKS.filter((stock) => stock.isMine);
  const mystocks = stocks.filter((stock) => stock.isMine);

  return (
    <>
      <h1>My Stock</h1>
      <StockList stocks={mystocks} basePath="/personal/mystock"></StockList>
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
          mode="mystock"
          onSubmit={async (data) => {
            try {
              await fetch(
                "https://windmill-be-iqxx.onrender.com/user/mystocks",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                }
              );
              alert("포지션이 추가되었습니다!");
            } catch (err) {
              alert("추가 실패");
              console.error(err);
            }
          }}
        />
      )}
    </>
  );
}

export default MyStock;
