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
    <div className="max-w-screen-lg mx-auto">
      <div className="p-7 flex justify-center">
        <div className="flex gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="border border-black bg-gray-200 text-gray-900 px-5 py-1.5 rounded no-underline transition-colors duration-200 hover:bg-[#C20E2F] hover:text-white"
          >
            + New Avatar
          </button>

          <button
            onClick={handleDeleteAll}
            className="border border-black bg-gray-200 text-gray-900 px-4 py-1 rounded no-underline transition-colors duration-200 hover:bg-red-600 hover:text-white"
          >
            전체 삭제
          </button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
          </div>
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
    </div>
  );
}

export default PortfolioPage;
