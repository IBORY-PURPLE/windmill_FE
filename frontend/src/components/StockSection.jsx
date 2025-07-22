import StockList from "./StockList";

function StockSection({ stocks, isLoading }) {
  return (
    <div>
      <h2>
        <StockList stocks={stocks} basePath="stocks" isLoading={isLoading} />
      </h2>
    </div>
  );
}

export default StockSection;
