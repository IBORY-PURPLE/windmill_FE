import PortfolioItem from "./PortfolioItem";

// 추천페이지에서 조건적으로 랜더링 가능한지 물어보자
// 자세히 버튼을 누른 상태값에 따라 다른 item을 출력하고싶다.
function PortfolioItemList({ results, showDetails }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {results.map((result) => {
        const chartData = result.graph || [];
        return (
          <li
            key={result.stockId}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <PortfolioItem
              result={result}
              chartData={chartData}
              showDetails={showDetails}
            ></PortfolioItem>
          </li>
        );
      })}
    </ul>
  );
}

export default PortfolioItemList;
