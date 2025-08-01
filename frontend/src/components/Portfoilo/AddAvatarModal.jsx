import { useState } from "react";

function AddAvatarModal({ onClose }) {
  const [age, setAge] = useState("");

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] border border-black">
        <h2>아바타 생성</h2>
        <input
          type="number"
          placeholder="나이"
          value={age}
          onChange={(e) => setAge(e.target.age)}
          className="border border-black px-3 py-1 w-full mb-2 bg-[#FFF8E0] text-black"
        ></input>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-[#C20E2F] hover:text-white"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAvatarModal;
