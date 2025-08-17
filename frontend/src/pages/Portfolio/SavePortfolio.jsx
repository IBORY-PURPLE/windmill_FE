// 추천받은 포트폴리오들을 저장하는 페이지
import { dummySavePortfolioList } from "../../assets/dummySavePortfolioList";
import { useNavigate, Outlet } from "react-router-dom";

function SavePortfolioPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen ">
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4">
        {dummySavePortfolioList.map((item) => (
          <div
            key={item.portfolioId}
            onClick={() => navigate(`${item.portfolioId}`)}
            className="mx-5 p-10 rounded-xl shadow-md border p-4 bg-white border-black transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavePortfolioPage;
