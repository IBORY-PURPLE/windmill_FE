import AvatarItem from "./AvatarItem";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

function AvatarList({ avatars, onAddNew }) {
  const navigate = useNavigate();

  if (!avatars || avatars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-6">
          <PlusCircle className="w-16 h-16 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">아바타가 없습니다</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          새로운 아바타를 생성하여 포트폴리오 관리를 시작해보세요.
          투자 성향에 맞는 아바타를 만들고 주식 시장을 탐험해보세요.
        </p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#C20E2F] hover:bg-[#A00D29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C20E2F] transition-colors duration-200"
        >
          <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
          새 아바타 생성하기
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">나의 아바타</h2>
          <p className="mt-1 text-sm text-gray-500">
            {avatars.length}개의 아바타가 있습니다
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => navigate(`/portfolio/${avatar.id}`)}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          >
            <AvatarItem avatar={avatar} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvatarList;
