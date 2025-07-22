import { useStocks } from "../context/StockContext";
import { useAuth } from "../context/AuthContext";

function StockItem({ stock }) {
  const { token } = useAuth();
  const { interestList, toggleInterest, isLoading, isInterestFetched } =
    useStocks();

  const isInterested = interestList.includes(stock.id);

  const handleClick = (e) => {
    e.preventDefault();
    toggleInterest(stock.id);
  };

  const shouldDelayRender = token ? isLoading || !isInterestFetched : isLoading;
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
