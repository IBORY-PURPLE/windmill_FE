// 아바타 페이지
// 이 페이지 하위에서 포트폴리오 추천과 추천받은 것을 저장하는 기능 추가
import { Outlet } from "react-router-dom";
import { Plus } from "lucide-react";
import AvatarNavigation from "../../components/Portfoilo/AvatarNavigation";

function AvatarPage() {
  const handleFabClick = () => {
    window.dispatchEvent(new Event("portfolio:toggleDetails"));
  };

  return (
    <div className="relative min-h-screen">
      {/* 콘텐츠 영역: 모바일에서 하단 네비 높이만큼 패딩 */}
      <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl pb-24 md:pb-0">
        <Outlet />
      </div>

      {/* FAB: 새 추천 받기/리프레시 용도 (원하는 핸들러에 연결해서 사용) */}
      <button
        type="button"
        className="fixed right-5 bottom-24 md:bottom-6 h-12 w-12 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 focus:outline-none focus-visible:ring ring-red-300 z-50"
        aria-label="새 포트폴리오 가져오기"
        onClick={handleFabClick}
      >
        <Plus size={22} className="mx-auto" aria-hidden="true" />
      </button>

      <AvatarNavigation />
    </div>
  );
}

export default AvatarPage;
