// 아바타 생성 페이지(성향체크)
import { useState } from "react";
import AddAvatarModal from "../../components/Portfoilo/AddAvatarModal";

function PortfolioPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1>아바타 생성</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="border border-black text-black px-4 py-2 rounded bg-white hover:bg-[#C20E2F] hover:text-white"
      >
        + New Avatar
      </button>

      {modalOpen && (
        <AddAvatarModal onClose={() => setModalOpen(false)}></AddAvatarModal>
      )}
    </div>
  );
}

export default PortfolioPage;
