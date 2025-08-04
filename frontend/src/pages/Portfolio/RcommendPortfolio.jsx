import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "../../api/portfolio";
import { NavLink, useParams } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// data: {
//   result: [
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//   ];

//   result2: [
//     { value: "", date: "" },
//     { value: "", date: "" },
//     { value: "", date: "" },
//     { value: "", date: "" },
//     { value: "", date: "" },
//   ];
// }

function RecommendPortfolioPage() {
  const avatarId = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["portfolio", avatarId],
    queryFn: () => fetchPortfolio(avatarId),
  });

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  if (isError) return <p>에러: {error.message}</p>;

  const { result, result2 } = data;

  return (
    <div className="border border-black bg-white rounded mx-2 p-2 mw-[40rem]">
      <h1 className="text-xl font-bold mt-4 mb-2">포트폴리오 추천</h1>
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {ticker}
                </h3>
                <span className="text-sm text-gray-500">비중 {ratio}</span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                수익률:{" "}
                <span className="font-semibold text-green-600">
                  {returnRate}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                평균 ROC:{" "}
                <span className="font-semibold text-blue-600">{avgRoc}</span>
              </p>
            </NavLink>
          </li>
        ))}
      </ul>

      <h2>투자 예상 그래프</h2>
      {result2 && (
        <div style={{ position: "relative", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            {/* 과거 실제 값: 진한 보라 */}
            <LineChart data={result2 || []}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="ds" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                dot={false}
                name="예측값"
                isAnimationActive={false} // 로딩시 flicker 방지
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RecommendPortfolioPage;
