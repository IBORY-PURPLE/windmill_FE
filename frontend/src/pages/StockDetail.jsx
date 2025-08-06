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

  const addStockMutation = useAddMyStock();

  const stock = stocks.find((s) => String(s.id) === stockId);

  const {
    data: newsList = [],
    isLoading: isNewsLoading,
    isError: isNewsError,
  } = useNews(showNews ? stock?.name : null);

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

  const predictMutation = useMutation({
    mutationFn: ({ stockId, selectedKeys, period }) =>
      predictStock({ stockId, selectedKeys, period }),
  });

  const handlePredict = () => {
    if (selectedOptions.length === 0) {
      toast.info("최소 하나의 항목을 선택하세요.");
      return;
    }
    const selectedKeys = selectedOptions.map((opt) => opt.value);
    setIsGraphLoading(true);
    predictMutation.mutate(
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
          toast.error("예측 데이터를 불러오는데 실패했습니다.");
        },
      }
    );
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
  };

  const handleTradeSubmit = (data) => {
    addStockMutation.mutate(data, {
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

  if (!stock) {
    return <p>존재하지 않는 종목입니다.</p>;
  }

  return (
    <div className={classes.container}>
      <h1>Stock Detail Page</h1>
      <p>
        Stock Name: {stock.name} ({stock.ticker})
      </p>

      {context === "mystock" && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            매도/매입
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
              setShowLogs((prev) => {
                if (!prev) {
                  refetchLogs();
                }
                return !prev;
              });
            }}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            {showLogs ? "거래 로그 닫기" : "거래 로그 보기"}
          </button>

          {showLogs && (
            <div
              className={`fixed top-0 right-0 h-full w-80 bg-white border-l shadow-lg z-50 transform transition-transform duration-500 translate-x-0 overflow-auto`}
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
              {!isLogLoading && !isLogError && stockLogs.length > 0 && (
                <ul>
                  {stockLogs.map((log, i) => (
                    <li key={i}>
                      {log.date} - 💸 {log.buy_cost}원 / 📈 {log.buy_stock_count}주
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
          ) : mystock ? (
            <>
              <div>
                <p>평단가 : {mystock.average_cost}</p>
                <p>구매 주식 수: {mystock.all_stock_count}</p>
              </div>

              <div style={{ width: 300, marginTop: 20 }}>
                <label>항목 선택</label>
                <Select
                  isMulti
                  options={MULTI_OPTIONS}
                  value={selectedOptions}
                  onChange={handleSelectChange}
                  placeholder="항목을 선택하세요."
                />
              </div>

              <div style={{ width: 300, marginTop: 20 }}>
                <label>기간 선택</label>
                <Select
                  options={PERIOD_OPTIONS}
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  placeholder="항목을 선택하세요."
                />
              </div>

              <button
                onClick={handlePredict}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isGraphLoading}
              >
                {isGraphLoading ? "그래프 그리는 중..." : "예측 그래프 그리기"}
              </button>

              {(isGraphLoading || predictedData) && (
                <div style={{ position: "relative", height: 400, marginTop: 20 }}>
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
                    <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>보유 주식 정보를 찾을 수 없습니다.</p>
          )}
        </>
      )}

      <div className="max-w-3xl mx-auto mt-4">
        <div className="flex justify-center">
          <button
            onClick={() => setShowNews((prev) => !prev)}
            className="mt-4 bg-transparent text-black px-4 py-2 rounded hover:border border-black"
          >
            {showNews ? "<관련 기사 닫기>" : "<관련 기사 보기>"}
          </button>
        </div>

        {showNews && (
          <div className="p-4 max-w-3xl mx-auto">
            {isNewsLoading ? (
              <p>뉴스 로딩 중...</p>
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
    </div>
  );
}

export default StockDetailPage;
