import { RefreshCcw } from "lucide-react";
import PortfolioItemList from "./PortfolioList";
import { useState } from "react";
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

  return (
    <div className="bg-white rounded mx-2 p-2 my-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold mt-4 mb-2">Portfolio</h1>
        <button
          onClick={onRefresh}
          className="hover:bg-gray-100 p-2 rounded-full transition"
          title="새 포트폴리오 불러오기"
        >
          <RefreshCcw size={20} />
        </button>
      </div>
      <PortfolioItemList results={result} showDetails={showDetails} />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-blue-600 transition border border-black"
        >
          {showDetails ? "-" : "+"}
        </button>
      </div>

      {result2 && (
        <div
          style={{ position: "relative", height: 400 }}
          className="bg-transparent"
        >
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
          <p>투자 예상 수익률</p>
        </div>
      )}
    </div>
  );
}

export default PortfolioSection;
