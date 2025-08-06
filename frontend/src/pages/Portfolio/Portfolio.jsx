import AddAvatarModal from "../../components/Portfoilo/AddAvatarModal";
import ErrorBox from "../../components/ErrorBox";
import AvatarList from "../../components/Portfoilo/AvatarList";
import { useAvatars } from "../../hooks/Portfolio/useAvatars";

function PortfolioPage() {
  const {
    avatars,
    isLoading,
    isError,
    error,
    handleAddAvatar,
    handleDeleteAll,
    modalOpen,
    setModalOpen,
  } = useAvatars();

  return (
    <div className="max-w-screen-lg mx-auto ">
      <div className="p-8 flex justify-center">
        <div className="flex gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="border border-black bg-gray-200 text-gray-900 px-6 py-2 rounded no-underline transition-colors duration-200 hover:bg-[#C20E2F] hover:text-white"
          >
            + New Avatar
          </button>

          <button
            onClick={handleDeleteAll}
            className="border border-black bg-gray-200 text-gray-900 px-6 py-2 rounded no-underline transition-colors duration-200 hover:bg-red-600 hover:text-white"
          >
            전체 삭제
          </button>
        </div>
      </div>

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
