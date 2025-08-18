import { useToggleInterestStock } from "../hooks/useToggleInterestStock";

function StockItem({ stock, isInterested }) {
  const { mutate } = useToggleInterestStock();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mutate({ stockId: stock.id, isAlreadyInterested: isInterested });
  };

  return (
    <div className="flex flex-col justify-between h-full  rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-100 hover:border-red-100">
      {/* Stock Info */}
      <div className="flex items-start justify-between">
          <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.name}</h3>
          <p className="text-sm text-gray-500">{stock.ticker}</p>
          </div>
          
        
        {/* Favorite Button */}
        <button
          onClick={handleClick}
          className={`p-2 rounded-full transition-colors ${
            isInterested 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-300 hover:text-red-400 hover:bg-gray-50'
          }`}
          aria-label={isInterested ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="sr-only">
            {isInterested ? 'Remove from favorites' : 'Add to favorites'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isInterested ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isInterested ? 0 : 1.5}
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>
      <div>
      <div>
          {stock.price && (
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ₩{stock.price.toLocaleString()}
              <span className={`ml-2 text-sm font-medium ${stock.change_rate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {stock.change_rate >= 0 ? '↑' : '↓'} {Math.abs(stock.change_rate)}%
              </span>
            </p>
          )}
          </div>
      {/* Additional Stock Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">시가총액</p>
            <p className="font-medium text-gray-900">
              {stock.marketCap ? `₩${(stock.marketCap / 100000000).toFixed(0)}조` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">거래량</p>
            <p className="font-medium text-gray-900">
              {stock.volume ? `${(stock.volume / 10000).toFixed(0)}만주` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default StockItem;