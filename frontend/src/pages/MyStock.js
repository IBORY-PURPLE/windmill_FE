import StockList from "../components/StockList";
import { useState } from "react";
import AddStockModal from "../components/AddStockModal";
import { getAuthToken } from "../util/auth";
import { useRouteLoaderData } from "react-router-dom";

function MyStock() {
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
    const data = response.json();
    return data.data;
  } catch (err) {
    console.error("MyStock loader 실패: ", err);
    return [];
  }
}

export default MyStock;
