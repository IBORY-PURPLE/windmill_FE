import { useMutation } from "@tanstack/react-query";
import { predictStock } from "../api/predict";

import { useParams, useRouteLoaderData } from "react-router-dom";
import classes from "./StockDetail.module.css";
import { useState } from "react";
import Select from "react-select";
import { useStocks } from "../context/StockContext";

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

const result = [
  { date: "2025-04-25", value: 14000.81 },
  { date: "2025-04-26", value: 15546.45 },
  { date: "2025-04-27", value: 16173.04 },
  { date: "2025-04-28", value: 17171.81 },
  { date: "2025-04-29", value: 18225.12 },
  { date: "2025-04-30", value: 18619.7 },
  { date: "2025-05-01", value: 18284.74 },
  { date: "2025-05-02", value: 18437.23 },
  { date: "2025-05-03", value: 18544.76 },
  { date: "2025-05-04", value: 19545.81 },
  { date: "2025-05-05", value: 19145.05 },
  { date: "2025-05-06", value: 19093.2 },
  { date: "2025-05-07", value: 19815.38 },
  { date: "2025-05-08", value: 18992.61 },
  { date: "2025-05-09", value: 19159.54 },
];

function StockDetailPage({ context }) {
  const myStocks = useRouteLoaderData("mystock");
  const { stocks } = useStocks();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { stockId } = useParams();

  const stock = stocks.find((s) => String(s.id) === stockId);

  const mystock =
    context === "mystock"
      ? myStocks.find((s) => String(s.stock_id) === stockId)
      : null;

  const [predictedData, setPredictedData] = useState(null);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ stockId, selectedKeys }) =>
      predictStock({ stockId, selectedKeys }),
    onSuccess: (data) => setPredictedData(data.result),
  });

  const handlePredict = () => {
    const selectedKeys = selectedOptions.map((opt) => opt.value);
    mutate({ stockId, selectedKeys });
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div className={classes.container}>
      <h1>Stock Detail Page</h1>
      <p>
        Stock Name: {stock.name} ({stock.ticker})
      </p>
      {context === "mystock" && (
        <>
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
          <button
            onClick={handlePredict}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            예측 그래프 그리기
          </button>
          {predictedData && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictedData}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}

export default StockDetailPage;
