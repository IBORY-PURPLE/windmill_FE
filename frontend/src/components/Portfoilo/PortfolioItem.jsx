import { NavLink } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PortfolioItem({ result, chartData, showDetails }) {
  const { stockId, ticker, ratio, returnRate, avgRoc } = result;
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <NavLink
        to={`/stocks/${stockId}`}
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

      {showDetails && chartData.length > 0 && (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="data"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PortfolioItem;
