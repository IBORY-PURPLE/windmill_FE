import { useToggleInterestStock } from "../hooks/useToggleInterestStock";

function StockItem({ stock, isInterested }) {
  const { mutate } = useToggleInterestStock();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mutate({ stockId: stock.id, isAlreadyInterested: isInterested });
  };

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
