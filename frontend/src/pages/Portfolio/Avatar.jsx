// 아바타 페이지
// 이 페이지 하위에서 포트폴리오 추천과 추천받은 것을 저장하는 기능 추가
import { Outlet } from "react-router-dom";
import AvatarNavigation from "../../components/Portfoilo/AvatarNavigation";

function AvatarPage() {
  return (
    <div>
      <AvatarNavigation></AvatarNavigation>
      <Outlet></Outlet>
    </div>
  );
}

export default AvatarPage;
