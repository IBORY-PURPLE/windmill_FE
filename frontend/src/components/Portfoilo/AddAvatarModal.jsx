import { useState } from "react";

function AddAvatarModal({ onClose, onSubmit }) {
  const [age, setAge] = useState("");
  const [lossTolerance, setLossTolerance] = useState(0);

  const handleSubmit = async () => {
    onSubmit({
      age: parseFloat(age),
      loss: parseFloat(lossTolerance),
    });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] border border-black">
        <h2>아바타 생성</h2>
        <input
          type="number"
          placeholder="나이"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border border-black px-3 py-1 w-full mb-2 bg-[#FFF8E0] text-black"
        ></input>
        <div className="mt-4">
          <label className="block mb-1 font-semibold">감당 가능한 손실률</label>
          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={lossTolerance}
            onChange={(e) => setLossTolerance(Number(e.target.value))}
            className="border border-black w-full appearance-none h-2 bg-gray-400 hover:bg-[#FFF8E0] rounded-full slider-thumb"
          />
          <div className="flex justify-between text-sm mt-1">
            {[0, 25, 50, 75, 100].map((val) => (
              <span key={val}>{val}%</span>
            ))}
          </div>
          <p className="text-right text-sm mt-1 text-gray-600">
            선택: <span className="font-semibold">{lossTolerance}%</span>
          </p>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-[#C20E2F] hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!age}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAvatarModal;
