import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// 툴팁의 내용을 커스텀하여 더 깔끔하게 표시합니다.
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.realValue ?? data.predictedValue;
    const label = data.realValue ? '실제 가격' : '예측 가격';

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
        <p className="text-sm text-gray-600">{data.date}</p>
        <p className="font-semibold" style={{ color: payload[0].color }}>
          {`${label}: ${Math.round(value).toLocaleString()} 달러`}
        </p>
      </div>
    );
  }
  return null;
};


const PredictionGraph = ({ predictedData, isLoading, realData }) => {
  // 👇 1. 실제 데이터와 예측 데이터를 하나의 배열로 합칩니다.
  const combinedData = useMemo(() => {
    // realData가 없거나 비어있으면 predictedData만 반환하도록 수정
    if (!realData || realData.length === 0) {
      if (!predictedData || predictedData.length === 0) return [];
      // predictedData는 `value` 키를 사용하므로 그대로 둡니다.
      return predictedData.map(d => ({ ...d, predictedValue: d.value }));
    }

    if (!predictedData || predictedData.length === 0) {
        // 👇 이 부분을 d.value에서 d.data로 수정했습니다.
        return realData.map(d => ({ ...d, realValue: d.data }));
    }
    
    // 👇 realData는 'data' 키, predictedData는 'value' 키를 사용하도록 수정합니다.
    const realPart = realData.map(d => ({ ...d, realValue: d.data }));
    const predictedPart = predictedData.map(d => ({ ...d, predictedValue: d.value }));

    const lastRealPoint = realPart[realPart.length - 1];
    if (lastRealPoint) {
      predictedPart.unshift({ ...lastRealPoint, predictedValue: lastRealPoint.realValue });
    }

    return [...realPart, ...predictedPart];
  }, [realData, predictedData]);
  // 👇 2. Y축의 범위를 전체 데이터 기준으로 동적으로 계산합니다.
  const yDomain = useMemo(() => {
    if (combinedData.length === 0) return ['auto', 'auto'];
    
    let min = Infinity;
    let max = -Infinity;

    combinedData.forEach(d => {
      const value = d.realValue ?? d.predictedValue;
      if (value < min) min = value;
      if (value > max) max = value;
    });

    const padding = (max - min) * 0.1; // 상하 10% 여유 공간
    return [min - padding, max + padding];
  }, [combinedData]);


  if (combinedData.length === 0 && !isLoading) return null;

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
      style={{ position: 'relative', height: 450 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={combinedData} 
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            tickFormatter={(value) => Math.round(value).toLocaleString()}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          
          {/* 👇 커스텀 툴팁을 적용합니다. */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* 👇 3. 실제 가격을 표시하는 Line (실선) */}
          <Line
            type="monotone"
            dataKey="realValue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="실제 가격"
          />
          
          {/* 👇 4. 예측 가격을 표시하는 Line (점선) */}
          <Line
            type="monotone"
            dataKey="predictedValue"
            stroke="#C20E2F"
            strokeWidth={2}
            strokeDasharray="5 5" // 점선 스타일
            dot={false}
            name="예측 가격"
          />
        </LineChart>
      </ResponsiveContainer>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fcf3f4] bg-opacity-80 z-10 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#C20E2F] border-solid"></div>
        </div>
      )}
    </div>
  );
};

export default PredictionGraph;