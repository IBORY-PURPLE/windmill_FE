import { useState } from "react";
import ErrorBox from "../../components/ErrorBox";
import AvatarList from "../../components/Portfoilo/AvatarList";
import { useAvatars } from "../../hooks/Portfolio/useAvatars";
import AddAvatarModalWithStepper from "../../components/Portfoilo/AddAvatarModalWithStepper";
import { FiPlus, FiRefreshCw, FiFilter } from "react-icons/fi";

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAvatars = avatars?.filter((avatar) => {
    return avatar.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            내 포트폴리오
          </h1>
          <p className="text-gray-600">
            나만의 투자 아바타를 관리하고 추적하세요
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C20E2F] focus:border-transparent h-10"
              placeholder="아바타 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter and Add Avatar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#C20E2F] hover:bg-[#A00D29] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm whitespace-nowrap h-10"
            >
              <FiPlus className="h-5 w-5" />
              <span>새 아바타</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">
                아바타를 불러오는 중입니다...
              </p>
            </div>
          ) : isError ? (
            <div className="p-8">
              <ErrorBox
                message={
                  error?.message ||
                  "아바타를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
                }
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 text-[#C20E2F] hover:text-[#A00D29]"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  <span>다시 시도</span>
                </button>
              </div>
            </div>
          ) : Array.isArray(filteredAvatars) && filteredAvatars.length > 0 ? (
            <AvatarList avatars={filteredAvatars} />
          ) : (
            <div className="text-center py-16 px-4">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-4">
                <FiPlus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                아바타를 찾을 수 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "검색어를 변경해보세요."
                  : "새 아바타를 생성하여 시작해보세요."}
              </p>
            </div>
          )}
        </div>

        {/* Add Avatar Modal */}
        {modalOpen && (
          <AddAvatarModalWithStepper
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddAvatar}
          />
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
