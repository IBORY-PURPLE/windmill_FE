import { useParams, useRouteLoaderData } from "react-router-dom";
import classes from "./StockDetail.module.css";
import { useState } from "react";
import Select from "react-select";
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
  { value: "interestRate", label: "금리" },
  { value: "closingPrice", label: "종가" },
  { value: "openingPrice", label: "시가" },
];

const result = [
  { date: "2025-04-25", value: 19722.81 },
  { date: "2025-04-26", value: 19546.45 },
  { date: "2025-04-27", value: 19173.04 },
  { date: "2025-04-28", value: 19171.81 },
  { date: "2025-04-29", value: 19225.12 },
  { date: "2025-04-30", value: 19619.7 },
  { date: "2025-05-01", value: 19284.74 },
  { date: "2025-05-02", value: 19437.23 },
  { date: "2025-05-03", value: 19544.76 },
  { date: "2025-05-04", value: 19545.81 },
  { date: "2025-05-05", value: 19145.05 },
  { date: "2025-05-06", value: 19093.2 },
  { date: "2025-05-07", value: 19815.38 },
  { date: "2025-05-08", value: 18992.61 },
  { date: "2025-05-09", value: 19159.54 },
];

function StockDetailPage({ context }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { stockId } = useParams();
  const interestStocks = useRouteLoaderData("intereststock");
  let stock = null;
  if (context === "interest") {
    stock = interestStocks?.find((s) => {
      console.log("비교 중: ", s.id, "vs", stockId);
      return s.id === stockId;
    });
  }

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div className={classes.container}>
      <h1>Stock Detail Page</h1>
      <p>Stock ID: {stockId}</p>
      <p>Context: {context}</p>
      {context === "interest" && stock && (
        <div>
          <h2>Stock name: {stock.name}</h2>
        </div>
      )}
      {context === "mystock" && (
        <div style={{ width: 300, marginTop: 20 }}>
          <label>항목 선택(다중)</label>
          <Select
            isMulti
            options={MULTI_OPTIONS}
            value={selectedOptions}
            onChange={handleSelectChange}
            placeholder="항목을 선택하세요."
          ></Select>
        </div>
      )}
      {context === "mystock" && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={result}>
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
    </div>
  );
}

export default StockDetailPage;
