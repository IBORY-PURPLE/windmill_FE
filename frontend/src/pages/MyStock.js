import StockList from "../components/StockList";
import { useState } from "react";
import AddStockModal from "../components/AddStockModal";
import { getAuthToken } from "../util/auth";
import { useRouteLoaderData } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MyStockPage() {
  const { token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const myStocks = useRouteLoaderData("mystock");

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-4">
        <h1>My Stock</h1>
        <StockList
          stocks={myStocks ?? []}
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
            onSubmit={async (data) => {
              try {
                await fetch(
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
                alert("포지션이 추가되었습니다!");
              } catch (err) {
                alert("추가 실패");
                console.error(err);
              }
            }}
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
    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error("MyStock loader 실패: ", err);
    return [];
  }
}

export default MyStockPage;
