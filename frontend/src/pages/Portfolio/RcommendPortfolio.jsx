import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "../../api/portfolio";
import { NavLink, useParams } from "react-router-dom";
import PortfolioItem from "../../components/Portfoilo/PortfolioItem";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PortfolioItemList from "../../components/Portfoilo/PortfolioList";

// data: {
//   result: [
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//   ];

// 종목별 수익률 예측 그래프
//   result2: [
//     {stockId: "", value: "", date: ""},
//     {stockId: "", value: "", date: ""},
//     {stockId: "", value: "", date: ""},
//     {stockId: "", value: "", date: ""},
//     {stockId: "", value: "", date: ""},
//   ];

// 포트폴리오 전체 수익율 예측 그래프
//    result3: [
//     {value: "", date: ""},
//     {value: "", date: ""},
//     {value: "", date: ""},
//     {value: "", date: ""},
//     {value: "", date: ""},
//    ]
// }

// 페이지 <div></div>에서 list로 종목별 item출력과 전체 수익률 그래프 출력하고
// 자세히 버튼을 누루면 종목별 수익률 그래프 출력 아에 page에서 list를 두개 출력하는게 편할 듯
// 페이지 단위에서 버튼으로 상태제어하고 expand true이면 그래프 list출력하는 느낌으로 가자.
function RecommendPortfolioPage() {
  const avatarId = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["portfolio", avatarId],
    queryFn: () => fetchPortfolio(avatarId),
  });

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  const { result, result2, result3 } = data;

  return (
    <div className="border border-black bg-white rounded mx-2 p-2 ">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : isError ? (
        <p>에러: {error.message}</p>
      ) : (
        <>
          <h1 className="text-xl font-bold mt-4 mb-2">포트폴리오 추천</h1>
          <PortfolioItemList results={result} />

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
        </>
      )}
    </div>
  );
}

export default RecommendPortfolioPage;
