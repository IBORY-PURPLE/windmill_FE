import StockItem from "./StockItem";
import { useNavigate } from "react-router-dom";

function StockList({ stocks, basePath }) {
  const navigate = useNavigate();

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
