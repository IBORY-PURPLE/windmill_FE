import { useState } from "react";
import { getAuthToken } from "../util/auth";

function StockItem({ stock }) {
  const [isInterested, setIsInterested] = useState(stock.interested);

  const handleInterestClick = async () => {
    const token = getAuthToken();

    try {
      const response = await fetch(
        `https://windmill-be-iqxx.onrender.com/user/interest/${stock.id}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(stock.id);

      if (!response.ok) throw new Error("관심 등록 실패");

      setIsInterested(true); // ✅ UI에서 버튼 사라지게
    } catch (err) {
      console.error(err);
      alert("관심 종목 등록 실패");
    }
  };

  return (
    <div className="flex justify-between items-center border p-2 mb-2">
      <div>
        <p className="font-bold">
          {stock.name} ({stock.ticker})
        </p>
        <p className="text-sm text-gray-600">현재가: {stock.price}</p>
      </div>
      {!isInterested && (
        <button
          onClick={(e) => {
            e.preventDefault(); // Link 클릭 방지
            handleInterestClick();
          }}
          className="text-sm bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
        >
          ⭐ 관심
        </button>
      )}
    </div>
  );
}

export default StockItem;
