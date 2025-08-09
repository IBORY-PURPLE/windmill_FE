import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { singleDeleteAvatar } from "../../api/avatar";

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
    <div className="relative rounded-xl shadow-md border p-4 bg-white border-black transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10">
      <p>{avatar?.name}</p>
      <p>{avatar?.age}</p>
      <p>{avatar?.loss}</p>
      <button
        type="button"
        onClick={(e) => handleDelete(e, avatar.id)}
        disabled={isPending}
        aria-label="아바타 삭제"
        title="삭제"
        className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default AvatarItem;
