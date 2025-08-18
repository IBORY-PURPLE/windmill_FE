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
  useStockChart,
  usePrefetchStockCharts,
  CHART_PERIODS,
} from "../hooks/useStockChart";
import StockPriceChart from "../components/StockPriceChart";


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
  const { stockId } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);
  const [predictedData, setPredictedData] = useState(null);
  const [isGraphLoading, setIsGraphLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showNews, setShowNews] = useState(false);

  // setDays 로직을 더 명확하게 수정
  const [days, setDays] = useState(7);

  // usePrefetchStockCharts는 사용되지 않는 듯 하여 제거.
  // 필요한 경우 days 상태를 반영하여 훅을 호출할 수 있습니다.
  const {
    data: chartData = [],
    isLoading: isChartLoading,
    isError: isChartError,
  } = useStockChart(stockId, days);

  const addMutation = useAddMyStock();

  // stock이 없는 경우를 대비한 early return
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

  const handleToggleLogs = () => {
    setShowLogs((prev) => {
      const newShowLogs = !prev;
      if (newShowLogs) {
        refetchLogs();
      }
      return newShowLogs;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{stock.name}</h1>
              <p className="mt-1 text-gray-500">
                {stock.ticker} • {stock.exchange}
              </p>
            </div>
            <div className="mt-4 flex space-x-3 md:mt-0">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">💰</span> 매도/매수
              </button>
              <button
                onClick={handleToggleLogs}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">📊</span> 거래 로그 보기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stock Info Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">현재 가격</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stock.currentPrice?.toLocaleString()}원
                </p>
                <p className={`mt-2 text-sm ${
                  stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent)}% (
                  {stock.changePrice >= 0 ? '+' : ''}
                  {stock.changePrice?.toLocaleString()}원)
                </p>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
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
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {period}일
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              {isChartLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <StockPriceChart data={chartData} />
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">주요 지표</h3>
            <dl className="space-y-4">
              {[
                { label: 'PER', value: stock.per },
                { label: 'PBR', value: stock.pbr },
                {
                  label: '배당수익률',
                  value: stock.dividendYield ? `${stock.dividendYield}%` : '-',
                },
                {
                  label: '52주 최고가',
                  value: stock.high52w?.toLocaleString(),
                },
                {
                  label: '52주 최저가',
                  value: stock.low52w?.toLocaleString(),
                },
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {metric.value || '-'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* News Toggle */}
        

        {context === 'mystock' && (
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
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">평단가</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mystock.average_cost.toLocaleString()}원
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
                <div
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                  style={{ position: 'relative', height: 450 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
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
                        isAnimationActive={false}
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
            </div>
            <button
          onClick={() => setShowNews(!showNews)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="text-sm font-medium text-gray-900">
            {showNews ? '기사 숨기기' : '관련 뉴스 보기'}
          </span>
          <span className="text-gray-400">{showNews ? '▲' : '▼'}</span>
        </button>
          </div>
        )}

        {/* News Section */}
        {showNews && (
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
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">거래 내역</h2>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-gray-400 hover:text-gray-500"
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
            <div className="flex-1 overflow-y-auto p-6">
              {isLogLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : stockLogs.length > 0 ? (
                <div className="space-y-4">
                  {stockLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {log.type === "BUY" ? "매수" : "매도"} • {log.quantity}주
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.price.toLocaleString()}원 • 총{" "}
                        {log.totalPrice.toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  거래 내역이 없습니다.
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