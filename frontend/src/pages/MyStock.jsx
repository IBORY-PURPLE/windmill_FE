import StockList from "../components/StockList";
import { useState, useMemo } from "react";
import AddStockModal from "../components/AddStockModal";
import { getAuthToken } from "../util/auth";
import { useRouteLoaderData } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStocks } from "../context/StockContext";

function MyStockPage() {
  const { token } = useAuth();
  const { stocks } = useStocks();

  const initialMyStocks = useRouteLoaderData("mystock");
  const [modalOpen, setModalOpen] = useState(false);
  const [myStocks, setMyStocks] = useState(initialMyStocks);

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

  const handleAddStock = async (data) => {
    try {
      const res = await fetch(
        `https://windmill-be-iqxx.onrender.com/user/mystock/${data.id}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buy_cost: data.purchasePrice,
            buy_stock_count: data.quantity,
            date: data.date,
          }),
        }
      );

      if (!res.ok) throw new Error("추가 실패");

      const newStock = {
        stock_id: data.id,
        buy_cost: data.purchasePrice,
        buy_stock_count: data.quantity,
        data: data.date,
        id: Date.now(),
      };
      setMyStocks((prev) => [...prev, newStock]);

      alert("포지션이 추가되었습니다.");
    } catch (err) {
      alert("추가 실패");
      console.log(err);
    }
  };

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <h1>My Stock</h1>
        <StockList
          stocks={myStockList ?? []}
          basePath="/personal/mystock"
        ></StockList>
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

export async function loader() {
  const token = getAuthToken();
  try {
    const response = await fetch(
      "https://windmill-be-iqxx.onrender.com/user/mystock",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("MyStock loader 실패: ", err);
    return [];
  }
}

export default MyStockPage;
