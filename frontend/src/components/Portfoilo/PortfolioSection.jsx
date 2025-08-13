import { RefreshCcw, Bookmark } from "lucide-react";
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
} from "recharts";

function PortfolioSection({ result, result2, onRefresh }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const toggleHandler = () => setShowDetails((prev) => !prev);
    window.addEventListener("portfolio:toggleDetails", toggleHandler);
    return () =>
      window.removeEventListener("portfolio:toggleDetails", toggleHandler);
  }, []);

  return (
    <div className="bg-white rounded mx-2 p-2 my-2 ">
      <div className="grid grid-cols-[1fr_auto] items-center">
        <h1 className="text-xl font-bold mt-4 mb-2">Portfolio</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="hover:bg-gray-100 p-2 rounded-full transition"
          >
            {showDetails ? "-" : "+"}
          </button>
          <button className="hover:bg-gray-100 p-2 rounded-full transition">
            <Bookmark size={20} />
          </button>
          <button
            onClick={onRefresh}
            className="hover:bg-gray-100 p-2 rounded-full transition mr-2"
            title="새 포트폴리오 불러오기"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>
      <PortfolioItemList results={result} showDetails={showDetails} />

      {result2 && (
        <div
          style={{ position: "relative", height: 400 }}
          className="bg-transparent mx-10, my-10 pb-20"
        >
          <div className="flex justify-center my-5">
            <p className="justify-center">포트폴리오 전체 수익률</p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            {/* 과거 실제 값: 진한 보라 */}
            <LineChart data={result2 || []}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="data"
                stroke="#d66369ff"
                dot={false}
                name="예측값"
                isAnimationActive={false} // 로딩시 flicker 방지
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PortfolioSection;
