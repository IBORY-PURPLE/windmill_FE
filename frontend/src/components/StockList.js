import StockItem from "./StockItem";
import { useNavigate } from "react-router-dom";

function StockList({ stocks, basePath, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        📡 주식 데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return <p>No stocks found.</p>;
  }

  return (
    <ul>
      {stocks.map((stock) => (
        <li
          key={stock.id}
          className="cursor-pointer"
          onClick={() => navigate(`${basePath}/${stock.id}`)}
        >
          <StockItem key={stock.id} stock={stock} />
        </li>
      ))}
    </ul>
  );
}

export default StockList;
