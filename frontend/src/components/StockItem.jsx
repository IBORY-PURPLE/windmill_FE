import { useToggleInterestStock } from "../hooks/useToggleInterestStock";

function StockItem({ stock, isInterested }) {
  const { mutate } = useToggleInterestStock();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mutate({ stockId: stock.id, isAlreadyInterested: isInterested });
  };

  return (
    <div className="relative rounded-xl shadow-md border p-4 bg-white border-black transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10">
      <button
        onClick={handleClick}
        className={`absolute top-2 right-3 text-xl transition ${isInterested
            ? "text-yellow-500"
            : "text-gray-400 hover:text-yellow-400 transition text-xl"
          }`}
      >
        <span className={`text-2xl ${isInterested ? "text-[#C20E2F]" : "text-gray-300"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.25}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </span>

      </button>
      <p className="font-bold text-base pr-8 truncate">{stock.name}</p>
      <p className="font-bold text-base">({stock.ticker})</p>
      <p className="text-sm text-gray-600 mt-1">현재가: {stock.price}</p>
    </div>
  );
}

export default StockItem;
