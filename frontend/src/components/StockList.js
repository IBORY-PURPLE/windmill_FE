import StockItem from "./StockItem";
import { Link } from "react-router-dom";

function StockList({ stocks }) {
  if (!stocks || stocks.length === 0) {
    return <p>No stocks found.</p>;
  }

  return (
    <ul>
      {stocks.map((stock) => (
        <li key={stock.id}>
          <Link to={`${stock.id}`}>
            <StockItem stock={stock}></StockItem>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default StockList;
