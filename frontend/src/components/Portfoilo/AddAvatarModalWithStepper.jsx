import { useState } from "react";
import Stepper, { Step } from "../../style/AddAvatarStepper";
import { X } from "lucide-react";

function AddAvatarModalWithStepper({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [lossTolerance, setLossTolerance] = useState(0);
  //   const [currentStep, setCurrentStep] = useState(1);

  //   const isNameValid = name.trim().length > 0;
  //   const isAgeValid = !isNaN(parseFloat(age)) && parseFloat(age) > 0;

  //   const isContinueDisabled =
  //     (currentStep === 1 && !isNameValid) || (currentStep === 2 && !isAgeValid);

  const handleComplete = () => {
    onSubmit({
      name,
      age: parseFloat(age),
      loss: parseFloat(lossTolerance),
    });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* <div className="relative bg-white rounded-lg p-6 w-[600px] border border-black"> */}
      <Stepper
        onFinalStepCompleted={handleComplete}
        nextButtonText="다음"
        backButtonText="이전"
        onClose={onClose}
        stepCircleContainerClassName="bg-white rounded"
        //   onStepChange={setCurrentStep}
        //   nextButtonProps={{
        //     disabled: isContinueDisabled,
        //     className: isContinueDisabled
        //       ? "bg-gray-400 cursor-not-allowed"
        //       : "bg-green-500 hover:bg-green-600 active:bg-green-700",
        //   }}
      >
        <Step>
          <div>
            <label className="block mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full border border-black px-3 py-2 rounded bg-[#FFF8E0]"
            />
            {/* {!isNameValid && (
                <p className="text-sm text-red-600 mt-1">
                  이름을 입력해주세요.
                </p>
              )} */}
          </div>
        </Step>

        <Step>
          <div>
            <label className="block mb-1">나이</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="나이를 입력하세요"
              className="w-full border border-black px-3 py-2 rounded bg-[#FFF8E0]"
            />
            {/* {!isAgeValid && (
                <p className="text-sm text-red-600 mt-1">
                  유효한 나이를 입력해주세요.
                </p>
              )} */}
          </div>
        </Step>

        <Step>
          <div>
            <label className="block mb-1 font-semibold">
              감당 가능한 손실률
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="25"
              value={lossTolerance}
              onChange={(e) => setLossTolerance(Number(e.target.value))}
              className="w-full"
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
        </Step>
      </Stepper>
      {/* </div> */}
    </div>
  );
}

export default AddAvatarModalWithStepper;
