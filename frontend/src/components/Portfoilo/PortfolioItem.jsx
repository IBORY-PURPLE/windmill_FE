import { NavLink } from "react-router-dom";

function PortfolioItem({ result }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {result.map(({ stockId, ticker, ratio, returnRate, avgRoc }) => (
        <li
          key={stockId}
          className="border border-black p-2 rounded hover:bg-gray-100 transition"
        >
          <NavLink
            to={`/stock/$${stockId}`}
            className="block bg-white border border-gray-300 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{ticker}</h3>
              <span className="text-sm text-gray-500">비중 {ratio}</span>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              수익률:{" "}
              <span className="font-semibold text-green-600">{returnRate}</span>
            </p>
            <p className="text-sm text-gray-700">
              평균 ROC:{" "}
              <span className="font-semibold text-blue-600">{avgRoc}</span>
            </p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default PortfolioItem;
