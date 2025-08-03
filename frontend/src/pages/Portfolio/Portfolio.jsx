// 아바타 생성 페이지(성향체크)
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddAvatarModal from "../../components/Portfoilo/AddAvatarModal";
import { addAvatar, fetchAvatars } from "../../api/portfolio";
import ErrorBox from "../../components/ErrorBox";
import AvatarList from "../../components/Portfoilo/AvatarList";

function PortfolioPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: avatars = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: fetchAvatars,
  });

  const { mutate } = useMutation({
    mutationFn: addAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["avatars"]);
    },
  });

  const handleAddAvatar = (data) => {
    mutate(data, {
      onSuccess: () => {
        alert("아바타가 추가되었습니다.");
        setModalOpen(false);
      },
      onError: (err) => {
        console.log(err);
        alert("아바타 추가 실패");
      },
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1>아바타 생성</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="border border-black text-black px-4 py-2 rounded bg-white hover:bg-[#C20E2F] hover:text-white"
      >
        + New Avatar
      </button>
      {isLoading ? (
        <p>아바타를 불러오고 있습니다...</p>
      ) : isError ? (
        <ErrorBox
          message={error?.message || "아바타를 불러오는데 실패했습니다."}
        />
      ) : Array.isArray(avatars) && avatars.length > 0 ? (
        <AvatarList avatars={avatars}></AvatarList>
      ) : (
        <p>"아바타를 추가해주세요."</p>
      )}

      {modalOpen && (
        <AddAvatarModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddAvatar}
        ></AddAvatarModal>
      )}
    </div>
  );
}

export default PortfolioPage;
