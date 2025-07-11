import StockItem from "./StockItem";

function StockList({ stocks }) {
  if (!stocks || stocks.length === 0) {
    return <p>No stocks found.</p>;
  }

  return (
    <ul>
      {stocks.map((stock) => (
        <StockItem key={stock.id} stock={stock}></StockItem>
      ))}
    </ul>
  );
}

export default StockList;
