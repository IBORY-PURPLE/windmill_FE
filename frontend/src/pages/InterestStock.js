import StockList from "../components/StockList";
// import DUMMY_STOCKS from "../data/stocks";
import { useStocks } from "../context/StockContext";
// import { useState } from "react";
// import AddStockModal from "../components/AddStockModal";

function InterestStock() {
  // const intereststocks = DUMMY_STOCKS.filter((stock) => stock.isInterested);
  // const [modalOpen, setModalOpen] = useState(false);
  const { stocks } = useStocks();

  const intereststocks = stocks.filter((s) => s.interested);

  return (
    <>
      <h1>Interest Stock</h1>
      <StockList
        stocks={intereststocks}
        basePath="/personal/intereststock"
      ></StockList>
      {/* <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + 관심종목 추가
      </button>
      {modalOpen && (
        <AddStockModal
          onClose={() => setModalOpen(false)}
          mode="interest"
          onSubmit={async (data) => {
            try {
              await fetch(
                "https://windmill-be-iqxx.onrender.com/user/interest",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                }
              );
              alert("관심 종목이 추가되었습니다!");
            } catch (err) {
              alert("추가 실패");
              console.error(err);
            }
          }}
        />
      )} */}
    </>
  );
}

export default InterestStock;
