import { useMutation, useQuery } from "@tanstack/react-query";
import { predictStock } from "../api/predict";
import { fetchMyStocks } from "../api/mystock";

import { useParams } from "react-router-dom";
import classes from "./StockDetail.module.css";
import { useState } from "react";
import Select from "react-select";
import { useStocks } from "../hooks/useStocks";

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
  { value: "openingPrice", label: "시가" }, // start
  { value: "highPrice", label: "고가" }, // high
  { value: "lowPrice", label: "저가" }, // low
  { value: "volume", label: "거래량" }, // volume
  { value: "interestRate", label: "고정금리" }, // fixed_rate
];

const PERIOD_OPTIONS = [
  { value: "5", label: "5일" },
  { value: "15", label: "15일" },
  { value: "30", label: "30일" },
];

// const result = [
//   { date: "2025-04-25", value: 14000.81 },
//   { date: "2025-04-26", value: 15546.45 },
//   { date: "2025-04-27", value: 16173.04 },
//   { date: "2025-04-28", value: 17171.81 },
//   { date: "2025-04-29", value: 18225.12 },
//   { date: "2025-04-30", value: 18619.7 },
//   { date: "2025-05-01", value: 18284.74 },
//   { date: "2025-05-02", value: 18437.23 },
//   { date: "2025-05-03", value: 18544.76 },
//   { date: "2025-05-04", value: 19545.81 },
//   { date: "2025-05-05", value: 19145.05 },
//   { date: "2025-05-06", value: 19093.2 },
//   { date: "2025-05-07", value: 19815.38 },
//   { date: "2025-05-08", value: 18992.61 },
//   { date: "2025-05-09", value: 19159.54 },
// ];

function StockDetailPage({ context }) {
  const { data: stocks = [] } = useStocks();
  const { stockId } = useParams();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);
  const [predictedData, setPredictedData] = useState(null);
  const [isGraphLoading, setIsGraphLoading] = useState(false);

  const stock = stocks.find((s) => String(s.id) === stockId);

  const {
    data: myStocks = [],
    isLoading: isMyStockLoading,
    isError: isMyStockError,
  } = useQuery({
    queryKey: ["myStocks"],
    queryFn: fetchMyStocks,
    enabled: context === "mystock", // 조건부 fetch
  });

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

  return (
    <div className={classes.container}>
      <h1>Stock Detail Page</h1>
      <p>
        Stock Name: {stock.name} ({stock.ticker})
      </p>
      {context === "mystock" && (
        <>
          {isMyStockLoading ? (
            <p>보유 주식 데이터를 불러오는 중...</p>
          ) : isMyStockError ? (
            <p>보유 종목 데이터를 불러오는데 실패했습니다...</p>
          ) : (
            <>
              {" "}
              <div>
                <p>평단가 : {mystock.average_cost}</p>
                <p>구매 주식 수: {mystock.all_stock_count}</p>
              </div>
              <div style={{ width: 300, marginTop: 20 }}>
                <label>Selecte Features</label>
                <Select
                  isMulti
                  options={MULTI_OPTIONS}
                  value={selectedOptions}
                  onChange={handleSelectChange}
                  placeholder="항목을 선택하세요."
                ></Select>
              </div>
              <div style={{ width: 300, marginTop: 20 }}>
                <label>Selecte Period</label>
                <Select
                  options={PERIOD_OPTIONS}
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  placeholder="항목을 선택하세요."
                ></Select>
              </div>
              <button
                onClick={handlePredict}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isGraphLoading}
              >
                {isGraphLoading ? "그래프 그리는 중...." : "예측 그래프 그리기"}
              </button>
              {(isGraphLoading || predictedData) && (
                <div style={{ position: "relative", height: 400 }}>
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
                    <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 z-10">
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
  );
}

export default StockDetailPage;
