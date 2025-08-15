import { useMutation, useQuery } from "@tanstack/react-query";
import { predictStock } from "../api/predict";
import { fetchMyStocks } from "../api/mystock";
import { useAddMyStock } from "../hooks/useAddMystock";
import { useMyStockLog } from "../hooks/useMyStockLog";
import SimpleStockModal from "../components/SimpleStockModal";
import ErrorBox from "../components/ErrorBox";
import { toast } from "react-toastify";

import { useParams, useNavigate } from "react-router-dom";
import classes from "./StockDetail.module.css";
import { useState } from "react";
import Select from "react-select";
import { useStocks } from "../hooks/useStocks";
import { useNews } from "../hooks/useNews";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MULTI_OPTIONS = [
  { value: "openingPrice", label: "시가" },
  { value: "highPrice", label: "고가" },
  { value: "lowPrice", label: "저가" },
  { value: "volume", label: "거래량" },
  { value: "interestRate", label: "고정금리" },
  { value: "per", label: "PER" },
  { value: "pbr", label: "PBR" },
  { value: "psr", label: "PSR" },
  { value: "snp", label: "S&P" },
  { value: "roe", label: "ROE" },
  { value: "roa", label: "ROA" },
  { value: "opm", label: "OPM" },
  { value: "npm", label: "NPM" },
];

const PERIOD_OPTIONS = [
  { value: "3", label: "3일" },
  { value: "7", label: "7일" },
  { value: "15", label: "15일" },
  { value: "30", label: "30일" },
];

// 디테일 컴포넌트 시작 /////////////////////////////////////////////////////////////////////////////////////////////////

function StockDetailPage({ context }) {
  const { data: stocks = [] } = useStocks();
  const { stockId } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);
  const [predictedData, setPredictedData] = useState(null);
  const [isGraphLoading, setIsGraphLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showNews, setShowNews] = useState(false);

  const addMutation = useAddMyStock();

  const stock = stocks.find((s) => String(s.id) === stockId);
  const {
    data: newsList = [],
    isLoading: isNewsLoading,
    isError: isNewsError,
  } = useNews(showNews ? stock.name : null);

  const {
    data: myStocks = [],
    isLoading: isMyStockLoading,
    isError: isMyStockError,
  } = useQuery({
    queryKey: ["myStocks"],
    queryFn: fetchMyStocks,
    enabled: context === "mystock",
  });

  const {
    stockLogs,
    isLoading: isLogLoading,
    isError: isLogError,
    error,
    refetch: refetchLogs,
    setQueryData,
  } = useMyStockLog(stockId, false);

  const mystock =
    context === "mystock"
      ? myStocks.find((s) => String(s.stock_id) === stockId)
      : null;

  const { mutate } = useMutation({
    mutationFn: ({ stockId, selectedKeys, period }) =>
      predictStock({ stockId, selectedKeys, period }),
  });

  const handlePredict = () => {
    const selectedKeys = selectedOptions.map((opt) => opt.value);
    setIsGraphLoading(true);
    mutate(
      { stockId, selectedKeys, period: selectedPeriod.value },
      {
        onSuccess: (data) => {
          const mapped = data.data.map((d) => ({
            date: d.date,
            value: d.data,
            type: d.type, 
          }));
          setPredictedData(mapped);
          setIsGraphLoading(false);
        },
        onError: () => {
          setIsGraphLoading(false);
        },
      }
    );
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
  };

  const handleTradeSubmit = (data) => {
    addMutation.mutate(data, {
      onSuccess: async (res) => {
        const remaining = res?.data?.all_stock_count || 0;

        if (remaining <= 0) {
          toast.info("모든 주식을 매도했습니다.");
          navigate("/personal/mystock");
          return;
        }

        toast.success("거래가 반영되었습니다.");
        await refetchLogs();
      },
      onError: () => {
        toast.error("오류 발생");
      },
    });
  };

  return (
    <>
      <div className="mx-auto my-8 p-8 w-[90%] max-w-5xl bg-gray-50 rounded-2xl shadow-lg border border-[#ad8961]/30 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#292826] mb-4 font-windmill">주식 상세 정보</h1>
          <div className="bg-blue-600 text-gray-100 px-6 py-3 rounded-full inline-block shadow-md">
            <p className="text-xl font-semibold">
              {stock.name} <span>({stock.ticker})</span>
            </p>
          </div>
        </div>
        {context === "mystock" && (
          <>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 bg-[#90d9e5] text hover:bg-[#04406d] text-white px-8 py-3 rounded-full font-semibold shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-windmill"
            >
              <span>💰</span> 매도/매수
            </button>

            {showModal && (
              <SimpleStockModal
                stockId={stockId}
                onClose={() => setShowModal(false)}
                onSubmit={handleTradeSubmit}
              />
            )}
            <button
              onClick={() => {
                if (showLogs) {
                  setShowLogs(false);
                } else {
                  setShowLogs(true);
                  refetchLogs();
                }
              }}
              className="mt-4 bg-[#90d9e5] hover:bg-[#04406d] text-white px-8 py-3 rounded-full font-semibold shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-windmill"
            >
              <span>📊</span> 거래 로그 보기
            </button>
            {showLogs && (
              <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-500 ${
                  showLogs ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {isLogLoading && <p>불러오는 중...</p>}
                {isLogError && (
                  <ErrorBox
                    message={error?.message || "거래 로그 조회 실패했습니다"}
                  />
                )}
                {!isLogLoading && !isLogError && stockLogs.length === 0 && (
                  <p>기록 없음</p>
                )}
                {!isLogLoading && !isLogError && (
                  <ul>
                    {stockLogs.map((log, i) => (
                      <li key={i}>
                        {log.date} - 💸 {log.buy_cost}원 / 📈{" "}
                        {log.buy_stock_count}주
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {isMyStockLoading ? (
              <p>보유 주식 데이터를 불러오는 중...</p>
            ) : isMyStockError ? (
              <p>보유 종목 데이터를 불러오는데 실패했습니다...</p>
            ) : (
              <>
                {" "}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📈</span> 보유 현황
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">평단가</p>
                      <p className="text-xl font-bold text-blue-600">{mystock.average_cost.toLocaleString()}원</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">보유 주식 수</p>
                      <p className="text-xl font-bold text-green-600">{mystock.all_stock_count}주</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🔍</span> 예측 설정
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">분석 항목 선택</label>
                      <Select
                        isMulti
                        options={MULTI_OPTIONS}
                        value={selectedOptions}
                        onChange={handleSelectChange}
                        placeholder="분석할 항목을 선택하세요"
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">예측 기간 선택</label>
                      <Select
                        options={PERIOD_OPTIONS}
                        value={selectedPeriod}
                        onChange={handlePeriodChange}
                        placeholder="예측 기간을 선택하세요"
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePredict}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isGraphLoading}
                >
                  {isGraphLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      <span>분석 중...</span>
                    </>
                  ) : (
                    <>
                      <span>📊</span>
                      <span>예측 그래프 생성</span>
                    </>
                  )}
                </button>
                {(isGraphLoading || predictedData) && (
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6" style={{ position: "relative", height: 450 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {/* 과거 실제 값: 진한 보라 */}
                      <LineChart data={predictedData || []}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          dot={false}
                          name="예측값"
                          isAnimationActive={false} // 로딩시 flicker 방지
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {isGraphLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#e5ecea] bg-opacity-80 z-10 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="max-w-4xl mx-auto mt-12 mb-20 px-4">
        <div className="flex justify-center">
          <button
            onClick={() => setShowNews((prev) => !prev)}
            className="bg-[#90d9e5] hover:bg-[#032e4d] text-white px-8 py-3 rounded-full font-semibold shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border-2 border-[#ad8961] font-windmill"
          >
            <span>{showNews ? "📰" : "📰"}</span>
            {showNews ? "관련 기사 닫기" : "관련 기사 보기"}
          </button>
        </div>
        {showNews && (
          <div className="p-4 max-w-3xl mx-auto">
            {isNewsLoading ? (
              <div className="flex justify-center items-center mt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
              </div>
            ) : isNewsError ? (
              <p>뉴스 불러오기 실패</p>
            ) : newsList.length === 0 ? (
              <p>관련 뉴스가 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {newsList.map((article, idx) => (
                  <li
                    key={idx}
                    className="group p-4 border rounded shadow-sm border-black bg-white transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10"
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:underline hover:text-[#C20E2F]"
                    >
                      {article.title}
                    </a>
                    <p className="text-sm text-gray-500">{article.pubDate}</p>
                    <p className="text-xs text-gray-600 mt-2 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-40">
                      {article.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StockDetailPage;
