import { Trash2, BarChart2, User, Percent } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { singleDeleteAvatar } from "../../api/avatar";
import TiltedCard from "../../style/AvatarCard";
import character from "../../assets/character.png";

function AvatarItem({ avatar }) {
  const queryClient = useQueryClient();

  const { mutate: deleteOne, isPending } = useMutation({
    mutationFn: singleDeleteAvatar,
    onMutate: async (avatarId) => {
      // 1. 백그라운드에 실행되고있는 refetch취소하고 낙관적 업데이트 실행 준비단계
      await queryClient.cancelQueries({ queryKey: ["avatars"] });

      // 2. 롤백값 저장
      const previousAvatars = queryClient.getQueryData(["avatars"]);

      // 3. 낙관적 업데이트 실행
      queryClient.setQueryData(["avatars"], (old) =>
        old ? old.filter((a) => a.id !== avatarId) : []
      );

      return { previousAvatars };
    },

    // 4. 실패 시 복구
    onError: (err, avatarId, context) => {
      if (context?.previousAvatars) {
        queryClient.setQueryData(["avatars"], context.previousAvatars);
      }
      alert("아바타 삭제에 실패했습니다.");
    },

    // 5. 성공/실패 상관없이 최신 캐시값으로 업데이트
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
    },
  });

  const handleDelete = (e, avatarId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!avatarId) return alert("삭제할 아바타 ID가 없습니다.");

    if (confirm("이 아바타를 삭제할까요?")) {
      deleteOne(avatarId);
    }
  };
  return (
    <div className="w-full max-w-xs mx-auto transform transition-all duration-300 hover:scale-105">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        {/* Avatar Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <img
            src={character}
            alt={`${avatar.name} 아바타`}
            className="h-32 w-32 object-contain"
          />
          
          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => handleDelete(e, avatar.id)}
            disabled={isPending}
            aria-label="아바타 삭제"
            title="삭제"
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Avatar Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate">{avatar.name}</h3>
              <p className="text-sm text-gray-500">나이: {avatar.age}세</p>
            </div>
            <div className="px-3 py-1 bg-red-50 rounded-full">
              <span className="text-sm font-medium text-red-600">손실률 {avatar.loss}%</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-red-400 to-red-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, avatar.loss))}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">0%</span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>
          
          {/* View Details Button */}
          <button className="mt-4 w-full py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200">
            상세 보기
          </button>
        </div>
      </div>
    </div>

    // <div className="relative rounded-xl shadow-md border p-4 bg-white border-black transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10">
    //   <p>{avatar?.name}</p>
    //   <p>{avatar?.age}</p>
    //   <p>{avatar?.loss}</p>
    //   <button
    //     type="button"
    //     onClick={(e) => handleDelete(e, avatar.id)}
    //     disabled={isPending}
    //     aria-label="아바타 삭제"
    //     title="삭제"
    //     className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
    //   >
    //     <Trash2 className="w-5 h-5" />
    //   </button>
    // </div>
  );
}

export default AvatarItem;
