import { useState } from "react";
import Stepper, { Step } from "../../style/AddAvatarStepper";
import {
  X,
  User,
  Hash,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function AddAvatarModalWithStepper({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [lossTolerance, setLossTolerance] = useState(25);
  const [currentStep, setCurrentStep] = useState(1);

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 10;
  const isAgeValid = age >= 10 && age <= 100;

  const handleComplete = () => {
    if (!isNameValid || !isAgeValid) return;

    onSubmit({
      name: name.trim(),
      age: parseInt(age, 10),
      loss: parseInt(lossTolerance, 10),
    });
    onClose();
  };

  const getStepStatus = (step) => {
    if (currentStep > step) return "completed";
    if (currentStep === step) return "active";
    return "pending";
  };

  const renderStepIndicator = (step, label) => {
    const status = getStepStatus(step);
    const isActive = status === "active";
    const isCompleted = status === "completed";

    return (
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            isActive
              ? "bg-[#C20E2F] text-white"
              : isCompleted
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isCompleted ? (
            <span className="text-lg">✓</span>
          ) : (
            <span className="font-medium">{step}</span>
          )}
        </div>
        <span
          className={`text-sm ${
            isActive || isCompleted
              ? "text-gray-900 font-medium"
              : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                아바타 이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="아바타 이름을 입력하세요 (2-10자)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  name && !isNameValid
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-[#C20E2F] focus:border-[#C20E2F]"
                } shadow-sm`}
                maxLength={10}
              />
              {name && !isNameValid && (
                <p className="mt-1 text-sm text-red-600">
                  이름은 2자 이상 10자 이하로 입력해주세요.
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-gray-500" />
                나이
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="나이를 입력하세요 (10-100세)"
                min="10"
                max="100"
                className={`w-full px-4 py-3 rounded-lg border ${
                  age && !isAgeValid
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-[#C20E2F] focus:border-[#C20E2F]"
                } shadow-sm`}
              />
              {age && !isAgeValid && (
                <p className="mt-1 text-sm text-red-600">
                  유효한 나이를 입력해주세요 (10-100세).
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2 text-gray-500" />
                감당 가능한 손실률
              </label>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-[#C20E2F]">
                    {lossTolerance}%
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    투자 시 감내할 수 있는 최대 손실률
                  </p>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  value={lossTolerance}
                  onChange={(e) => setLossTolerance(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C20E2F]"
                />

                <div className="flex justify-between mt-6 px-2">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLossTolerance(val)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        parseInt(lossTolerance) === val
                          ? "bg-[#C20E2F] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p className="mb-1">
                  <span className="font-medium text-gray-700">낮은 위험:</span>{" "}
                  0-25% (안정적인 투자)
                </p>
                <p className="mb-1">
                  <span className="font-medium text-gray-700">중간 위험:</span>{" "}
                  26-50% (균형 잡힌 투자)
                </p>
                <p>
                  <span className="font-medium text-gray-700">높은 위험:</span>{" "}
                  51-100% (공격적인 투자)
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !isNameValid;
    if (currentStep === 2) return !isAgeValid;
    return false;
  };

  const handleNext = () => {
    if (isNextDisabled()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              새로운 아바타 생성
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8 px-4">
            {renderStepIndicator(1, "기본 정보")}
            <div className="flex-1 flex items-center px-2">
              <div className="w-full h-0.5 bg-gray-200" />
            </div>
            {renderStepIndicator(2, "나이 설정")}
            <div className="flex-1 flex items-center px-2">
              <div className="w-full h-0.5 bg-gray-200" />
            </div>
            {renderStepIndicator(3, "위험 수준")}
          </div>

          {/* Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> 이전
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isNextDisabled()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#C20E2F] hover:bg-[#A00D29]"
                }`}
              >
                다음 <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium text-white bg-[#C20E2F] hover:bg-[#A00D29]"
              >
                아바타 생성하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAvatarModalWithStepper;
