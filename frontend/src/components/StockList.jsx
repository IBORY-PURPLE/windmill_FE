import StockItem from "./StockItem";
import { useNavigate } from "react-router-dom";

function StockList({ stocks, basePath }) {
  const navigate = useNavigate();

  // if (isLoading) {
  //   return (
  //     <div className="text-center text-gray-500 py-8">
  //       📡 주식 데이터를 불러오는 중입니다...
  //     </div>
  //   );
  // }

  const enableInterest = basePath === "/personal/intereststock";

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
          <StockItem
            key={stock.id}
            stock={stock}
            enableInterest={enableInterest}
          />
        </li>
      ))}
    </ul>
  );
}

export default StockList;
