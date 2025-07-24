import { useInterestStocks } from "../hooks/useInterestStocks";
import { useToggleInterestStock } from "../hooks/useToggleInterestStock";
import { useAuth } from "../context/AuthContext";

function StockItem({ stock, enableInterest }) {
  const { token } = useAuth();
  const {
    data: interestList = [],
    isLoading,
    isError,
  } = useInterestStocks({
    enabled: enableInterest && !!token,
  });
  const { mutate } = useToggleInterestStock();

  const isInterested = interestList.includes(stock.id) ?? false;

  const handleClick = (e) => {
    e.preventDefault();
    mutate({ stockId: stock.id, isAlreadyInterested: isInterested });
  };

  // 수정
  const shouldDelayRender = token ? isLoading : isLoading;
  if (shouldDelayRender) return null;

  return (
    <div className="flex justify-between items-center border p-2 mb-2">
      <div>
        <p className="font-bold">
          {stock.name} ({stock.ticker})
        </p>
        <p className="text-sm text-gray-600">현재가: {stock.price}</p>
      </div>
      <button
        onClick={handleClick}
        className={`text-sm px-2 py-1 rounded ${
          isInterested
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-gray-600 hover:bg-yellow-300"
        }`}
      >
        {isInterested ? "⭐ 관심 중" : "☆ 관심 추가"}
      </button>
    </div>
  );
}

export default StockItem;
