import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "../../api/portfolio";
import { useParams } from "react-router-dom";
import { dummyPortfoilo } from "../../assets/dummyPortfolio";
import PortfolioSection from "../../components/Portfoilo/PortfolioSection";

// data: {
//   result: [
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "",
//      graph: [
//              {data: "", date: ""},
//              {data: "", date: ""},
//              {data: "", date: ""},
//              {data: "", date: ""}
//      ]},
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "",
//       graph: [
//              {data: "", date: ""},
//              {data: "", date: ""},
//              {data: "", date: ""},
//              {data: "", date: ""}
//      ]},
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//     { stockId: "", ticker: "", ratio: "", returnRate: "", avgRoc: "" },
//   ];

// 포트폴리오 전체 수익율 예측 그래프
//    result2: [
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
  const { avatarId } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["portfolio", avatarId],
    queryFn: () => fetchPortfolio(avatarId),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">포트폴리오를 불러오는 중입니다...</p>
            <p className="mt-4 text-lg text-gray-600">포트폴리오 생성에는 3분정도 소요됩니다</p>
          </div>
        </div>
    );
  }

  if (isError) {
    return <p>에러: {error.message}</p>;
  }

  return (
    <>
      <PortfolioSection {...data} onRefresh={refetch}></PortfolioSection>
    </>
  );
}

export default RecommendPortfolioPage;
