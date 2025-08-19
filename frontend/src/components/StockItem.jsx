import { useToggleInterestStock } from "../hooks/useToggleInterestStock";
import FavoriteButton from "./FavoriteButton";

function StockItem({ stock, isInterested }) {

  return (
    <div className="flex flex-col justify-between h-full  rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-100 hover:border-red-100">
      {/* Stock Info */}
      <div className="flex items-start justify-between">
          <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.name}</h3>
          <p className="text-sm text-gray-500">{stock.ticker}</p>
          </div>
          
        
        {/* Favorite Button */}
        <FavoriteButton stockId={stock.id} isInterested={isInterested} />
      </div>
      <div>
      <div>
          {stock.price && (
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${stock.price.toLocaleString()}
              <span className={`ml-2 text-sm font-medium ${stock.change_rate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {stock.change_rate >= 0 ? '↑' : '↓'} {Math.abs(stock.change_rate)}%
              </span>
            </p>
          )}
          </div>
      {/* Additional Stock Info */}
    </div>
    </div>
  );
}

export default StockItem;