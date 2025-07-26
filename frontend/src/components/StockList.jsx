import StockItem from "./StockItem";
import { useNavigate } from "react-router-dom";

function StockList({ stocks, basePath, interestList }) {
  const navigate = useNavigate();

  // if (isLoading) {
  //   return (
  //     <div className="text-center text-gray-500 py-8">
  //       📡 주식 데이터를 불러오는 중입니다...
  //     </div>
  //   );
  // }

  if (!stocks || stocks.length === 0) {
    return <p>No stocks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stocks.map((stock) => (
        <div
          key={stock.id}
          className="cursor-pointer"
          onClick={() => navigate(`${basePath}/${stock.id}`)}
        >
          <StockItem
            stock={stock}
            isInterested={interestList.includes(stock.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default StockList;
