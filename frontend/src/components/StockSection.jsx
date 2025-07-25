import StockList from "./StockList";

function StockSection({ stocks, interestList }) {
  return (
    <div>
      <h2>
        <StockList
          stocks={stocks}
          interestList={interestList}
          basePath="stocks"
        />
      </h2>
    </div>
  );
}

export default StockSection;
