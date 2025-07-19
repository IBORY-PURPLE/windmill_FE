import StockList from "./StockList";

function StockSection({ stocks }) {
  return (
    <div>
      <h2>
        <StockList stocks={stocks} />
      </h2>
    </div>
  );
}

export default StockSection;
