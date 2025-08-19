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
import React, { useState, useMemo } from "react";
import Select from "react-select";
import { useStocks } from "../hooks/useStocks";
import { useNews } from "../hooks/useNews";
import { useStockChart, usePrefetchStockCharts } from "../hooks/useStockChart";
import StockPriceChart from "../components/StockPriceChart";
import FavoriteButton from "../components/FavoriteButton";
import { useInterestStocks } from "../hooks/useInterestStocks";
import PredictionGraph from "../components/PredictionGraph";

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

function StockDetailPage({ context }) {
  const { data: stocks = [] } = useStocks();
  const { data: interestList = [] } = useInterestStocks();

  const { stockId } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([
    { value: "closingPrice", label: "종가" },
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);
  const [predictedData, setPredictedData] = useState(null);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [days, setDays] = useState(7);
  const realDataDays = selectedPeriod.value * 2;
  const {
    data: chartData = [],
    isLoading: isChartLoading,
    error: chartError,
  } = useStockChart(stockId, days);
  const { data: realData = [] } = useStockChart(stockId, realDataDays);
  const addMutation = useAddMyStock();
  const stock = stocks.find((s) => String(s.id) === stockId);
  if (!stock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-gray-500">
          주식 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }
  const {
    data: newsList = [],
    isLoading: isNewsLoading,
    isError: isNewsError,
  } = useNews({
    query: stock.name, // 쿼리할 종목명
    enabled: showNews, // showNews가 true일 때만 쿼리 실행
  });
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
  } = useMyStockLog(stockId, showLogs);
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
          // 1. 백엔드에서 받은 전체 데이터 배열을 가져옵니다.
          const allData = data.data;

          // 2. 이 데이터 중에서 type이 'predict'인 항목만 필터링합니다.
          const predictedOnly = allData.filter((d) => d.type === "predict");

          // 3. 필터링된 예측 데이터만 predictedData 상태에 저장합니다.
          const mapped = predictedOnly.map((d) => ({
            date: d.date,
            value: d.data, // 또는 d.value, 백엔드 응답에 따라
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
  const isInterested = useMemo(() => {
    // stock 객체나 interestList가 아직 로드되지 않았으면 false
    if (!stock || !interestList) return false;
    // interestList 배열에 현재 stock.id와 일치하는 항목이 있는지 확인
    return interestList.includes(stock.id);
  }, [stock, interestList]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    setPredictedData(null);
  };
  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
    setPredictedData(null);
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
  const handleToggleLogs = () => {
    setShowLogs((prev) => !prev);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 break-words">
                {stock.name}
              </h1>
              <p className="mt-1 text-gray-500">
                {stock.ticker} • {stock.exchange}
              </p>
            </div>
            {["mystock", "interest"].includes(context) && (
              <div className="mt-4 flex space-x-3 md:mt-0 flex-shrink-0">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#C20E2F] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="mr-2">💰</span> 매도/매수
                </button>
                <button
                  onClick={handleToggleLogs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="mr-2">📊</span> 거래 로그 보기
                </button>
              </div>
            )}
            {context === "Home" && (
              <div className="mt-4 flex space-x-3 md:mt-0 flex-shrink-0">
                <FavoriteButton stockId={stockId} isInterested={isInterested} />
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">현재 가격</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stock.price?.toLocaleString()}달러
                </p>
                <p
                  className={`mt-2 text-sm ${
                    stock.change_rate >= 0 ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {stock.change_rate >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(stock.change_rate)}% (
                  {stock.change_price >= 0 ? "+" : ""}
                  {stock.change_price?.toLocaleString()}달러)
                </p>
              </div>
              <div className="h-16 w-16 bg-[#fcf3f4] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#C20E2F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">주가 추이</h3>
              <div className="flex space-x-2">
                {[7, 30, 90, 365].map((period) => (
                  <button
                    key={period}
                    onClick={() => setDays(period)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      days === period
                        ? "bg-[#fcf3f4] text-[#C20E2F]"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {period}일
                  </button>
                ))}
              </div>
            </div>
            <div className="h-100">
              {isChartLoading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mx-auto"></div>
                  <p className="mt-4 text-lg text-gray-600">
                    그래프를 불러오는 중입니다...
                  </p>{" "}
                </div>
              ) : (
                <StockPriceChart data={chartData} />
              )}
            </div>
          </div>
        </div>

        {context === "mystock" && (
          <div className="space-y-6">
            {/* 보유 현황 카드 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📈</span> 보유 현황
              </h3>
              {isMyStockLoading ? (
                <p>보유 주식 데이터를 불러오는 중...</p>
              ) : isMyStockError || !mystock ? (
                <p>보유 종목 데이터를 불러오는데 실패했습니다...</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#fcf3f4] p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">평단가</p>
                    <p className="text-xl font-bold text-[#C20E2F]">
                      {mystock.average_cost.toLocaleString()}달러
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">보유 주식 수</p>
                    <p className="text-xl font-bold text-green-600">
                      {mystock.all_stock_count}주
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 예측 설정 카드 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔍</span> 예측 설정
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    분석 항목 선택
                  </label>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예측 기간 선택
                  </label>
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
            {/* 예측 버튼 및 그래프 */}
            <div className="space-y-4">
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
                <PredictionGraph
                  predictedData={predictedData}
                  isLoading={isGraphLoading}
                  realData={realData}
                />
              )}
            </div>
            <button
              onClick={() => setShowNews(!showNews)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C20E2F]"
            >
              <span className="text-sm font-medium text-gray-900">
                {showNews ? "기사 숨기기" : "관련 뉴스 보기"}
              </span>
              <span className="text-gray-400">{showNews ? "▲" : "▼"}</span>
            </button>
          </div>
        )}

        {/* News Section */}
        {showNews && !isNewsLoading && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">최신 뉴스</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {isNewsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-solid"></div>
                  </div>
                ) : isNewsError ? (
                  <p className="p-4 text-gray-500 text-center">
                    뉴스 불러오기 실패
                  </p>
                ) : newsList.length === 0 ? (
                  <p className="p-4 text-gray-500 text-center">
                    관련 뉴스가 없습니다.
                  </p>
                ) : (
                  <ul className="space-y-4 p-4">
                    {newsList.map((article, idx) => (
                      <li
                        key={idx}
                        className="group border rounded shadow-sm border-black bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:z-10"
                      >
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4"
                        >
                          <h3 className="text-lg font-semibold hover:underline hover:text-[#C20E2F]">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {article.pubDate}
                          </p>
                          <p className="text-xs text-gray-600 mt-2 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-40">
                            {article.description}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Transaction Logs Sidebar */}
      {showLogs && (
        // 1. 전체 화면을 덮는 컨테이너 (중앙 정렬 역할)
        // 기존 오버레이와 모달을 하나로 묶고 중앙 정렬을 추가합니다.
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowLogs(false)}
        >
          {/* 2. 실제 팝업(모달) 패널 */}
          {/* e.stopPropagation()을 이용해 패널 내부 클릭 시 창이 닫히는 것을 방지 */}
          <div
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header -> Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">거래 내역</h2>
                <button
                  onClick={() => setShowLogs(false)}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar Content -> Modal Content */}
            {/* overflow-y-auto를 통해 내용이 길어지면 자동 스크롤 */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLogLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C20E2F]"></div>
                </div>
              ) : isLogError ? (
                <ErrorBox
                  message={error?.message || "거래 로그 조회에 실패했습니다."}
                />
              ) : stockLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  거래 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 👇 이 부분이 핵심입니다. */}
                  {stockLogs
                    // 1. 원본 배열을 변경하지 않기 위해 .slice()로 복사본을 만듭니다.
                    .slice()
                    // 2. b.date와 a.date를 비교하여 최신 날짜가 위로 오도록 정렬합니다.
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    // 3. 정렬된 배열을 화면에 렌더링합니다.
                    .map((log) => {
                      const isBuy = log.buy_stock_count > 0;
                      return (
                        <div
                          key={log.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            isBuy
                              ? "border-red-500 bg-red-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          {/* ... (기존 로그 아이템 내용) ... */}
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-sm font-bold ${
                                isBuy ? "text-red-700" : "text-blue-700"
                              }`}
                            >
                              {isBuy ? "매수" : "매도"} •{" "}
                              {Math.abs(log.buy_stock_count ?? 0)}주
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.date).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-800">
                            <span className="text-gray-600">
                              {isBuy ? "총 매수 금액:" : "총 매도 금액:"}
                            </span>
                            <span className="font-medium ml-1">
                              {Math.abs(log.buy_cost ?? 0).toLocaleString()}달러
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <SimpleStockModal
            stockId={stockId}
            onClose={() => setShowModal(false)}
            onSubmit={handleTradeSubmit}
          />
        </div>
      )}
      {showLogs && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowLogs(false)}
        ></div>
      )}
    </div>
  );
}

export default StockDetailPage;
