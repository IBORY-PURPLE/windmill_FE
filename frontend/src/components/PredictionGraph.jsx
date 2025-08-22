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
    if (!realData && !predictedData) {
      return [];
    }
  
    const dataMap = new Map();
  
    // 1. realData를 먼저 Map에 추가합니다.
    if (realData) {
      realData.forEach(item => {
        // realData는 'data' 키를 사용합니다.
        dataMap.set(item.date, {
          date: item.date,
          realValue: item.data,
        });
      });
    }
  
    // 2. predictedData를 순회하며 Map에 병합합니다.
    if (predictedData) {
      predictedData.forEach(item => {
        const dateKey = item.date;
        // Map에 이미 해당 날짜의 데이터가 있는지 확인합니다.
        let existingEntry = dataMap.get(dateKey) || { date: dateKey };
  
        // predictedData는 'value' 키를 사용합니다.
        // 예측 데이터의 값을 predictedValue에 할당합니다.
        existingEntry.predictedValue = item.value;
  
        dataMap.set(dateKey, existingEntry);
      });
    }
    
    // 3. Map의 값을 배열로 변환하고 날짜순으로 정렬합니다.
    const combined = Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // 4. 과거 데이터의 마지막 지점과 예측 데이터의 시작점을 연결합니다.
    const lastRealIndex = combined.findLastIndex(d => d.realValue != null);
  
    if (lastRealIndex !== -1 && combined[lastRealIndex]) {
      combined[lastRealIndex].predictedValue = combined[lastRealIndex].realValue;
    }
  
    // 최종적으로 중복이 제거되고, 하나의 객체로 합쳐진 데이터를 반환합니다.
    return combined;
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