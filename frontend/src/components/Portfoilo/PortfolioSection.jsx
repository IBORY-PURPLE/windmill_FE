import { RefreshCcw, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import PortfolioItemList from "./PortfolioList";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function PortfolioSection({ result, result2, result3, onRefresh }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPortfolioSaved, setIsPortfolioSaved] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
  };
  useEffect(() => {
    const toggleHandler = () => setShowDetails((prev) => !prev);
    window.addEventListener("portfolio:toggleDetails", toggleHandler);
    return () =>
      window.removeEventListener("portfolio:toggleDetails", toggleHandler);
  }, []);

  const toggleSavePortfolio = () => {
    setIsPortfolioSaved(!isPortfolioSaved);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-2 my-4">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">포트폴리오</h1>
            <p className="text-sm text-gray-500 mt-1">
              추천 포트폴리오를 확인하고 저장하세요
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSavePortfolio}
              className={`p-2 rounded-full transition-colors ${
                isPortfolioSaved
                  ? "text-yellow-500 hover:bg-yellow-50"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title={isPortfolioSaved ? "저장됨" : "포트폴리오 저장"}
            >
              <Bookmark
                size={20}
                className={isPortfolioSaved ? "fill-current" : ""}
              />
            </button>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="새 포트폴리오 불러오기"
            >
              <RefreshCcw size={20} />
            </button>
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={showDetails ? "접기" : "자세히 보기"}
            >
              {showDetails ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="px-4 py-2">
        <PortfolioItemList results={result} showDetails={showDetails} />
      </div>

      {/* Portfolio Chart */}
      {result2 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-1.5 h-5 bg-red-500 rounded-full mr-2"></span>
              포트폴리오 전체 수익률
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result2 || []}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  interval="preserveStart"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 13, fill: "#000000" }}
                  axisLine={{ stroke: "#000000", strokeWidth: 1 }}
                  tickLine={{ stroke: "#000000" }}
                  padding={{ left: 10 }}
                />
                <YAxis
                  tick={{ fontSize: 15, fill: "#000000" }}
                  tickLine={false}
                  axisLine={{ stroke: "#000000", strokeWidth: 1 }}
                  padding={{ bottom: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    padding: "0.5rem",
                  }}
                  labelStyle={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                  formatter={(value) => [`${value}%`, "수익률"]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="star"
                  iconSize={0}
                  wrapperStyle={{
                    paddingBottom: "1rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="data"
                  stroke="#C20E2F"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#C20E2F",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name="수익률"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {result3 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6">
                  <img 
                    src="/src/assets/icons8-gemini-ai-48.png" 
                    alt="Gemini AI" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">포트폴리오 분석</h3>
                  <div className="mt-2 text-sm text-gray-700 space-y-2">
                    <p>{result3}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PortfolioSection;
