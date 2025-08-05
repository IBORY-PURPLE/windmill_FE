import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchAvatars, addAvatar, allDeleteAvatar } from "../../api/portfolio";

export function useAvatars() {
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

  const { mutate: addAvatarMutate } = useMutation({
    mutationFn: addAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["avatars"]);
    },
  });

  const { mutate: deleteAllMutate } = useMutation({
    mutationFn: allDeleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["avatars"]);
      alert("전체 아바타가 삭제되었습니다.");
    },
    onError: (err) => {
      console.log(err);
      alert("전체 삭제에 실패했습니다.");
    },
  });

  const handleAddAvatar = (data, onSucces) => {
    addAvatarMutate(data, {
      onSuccess: () => {
        alert("아바타가 추가되었습니다.");
        setModalOpen(false);
        if (onSucces) onSucces();
      },
      onError: (err) => {
        console.log(err);
        alert("아바타 추가 실패");
      },
    });
  };

  const handleDeleteAll = () => {
    if (confirm("정말 전체 삭제하시겠습니까?")) {
      deleteAllMutate();
    }
  };

  return {
    avatars,
    isLoading,
    isError,
    error,
    modalOpen,
    setModalOpen,
    handleAddAvatar,
    handleDeleteAll,
  };
}
