import { NavLink } from "react-router-dom";
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend, // Legend를 import 합니다.
} from "recharts";
import { BarChart2, TrendingUp } from 'lucide-react';

function formatNumber(num) {
  if (!num) return '0.00';
  return parseFloat(num).toFixed(2);
}


function PortfolioItem({ result, chartData, showDetails }) {
  const { stockId, ticker, ratio, returnRate, avgRoc } = result;
  const isPositive = parseFloat(returnRate) >= 0;
  const isRocPositive = parseFloat(avgRoc) >= 0;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };
  // Recharts가 올바르게 렌더링할 수 있도록 데이터를 변환하는 로직을 개선합니다.
  /*
  const transformedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    const dataMap = new Map();
    chartData.forEach(item => {
      // 날짜 형식을 'YYYY-MM-DD'로 통일하여 키로 사용합니다.
      const dateKey = item.date.split(' ')[0];
      const entry = dataMap.get(dateKey) || { date: dateKey };
      
      //if (item.type === 'historical') {
      //  entry.historical = item.data;
      //}
      if (item.type === 'predict') {
        entry.predicted = item.data;
      }
      dataMap.set(dateKey, entry);
    });
    // 2. Map을 배열로 변환하고 날짜순으로 정렬합니다. (가장 중요)
    const combined = Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. 과거 데이터의 마지막 지점을 찾아 예측 데이터와 자연스럽게 연결합니다.
    const lastHistoricalIndex = combined.findLastIndex(d => d.historical != null);

    if (lastHistoricalIndex !== -1 && combined[lastHistoricalIndex]) {
      // 예측 라인이 과거 라인의 마지막 값에서 시작되도록 연결점을 만들어줍니다.
      combined[lastHistoricalIndex].predicted = combined[lastHistoricalIndex].historical;
    }

    return combined;
  }, [chartData]);
*/

const transformedData = useMemo(() => {
  if (!chartData || chartData.length === 0) return [];

  const dataMap = new Map();
  chartData.forEach(item => {
    if (item.type !== 'predict') return; // ✅ predict만 사용

    const dateKey = item.date.split(' ')[0]; // YYYY-MM-DD
    const entry = dataMap.get(dateKey) || { date: dateKey };

    entry.predicted = item.data;
    dataMap.set(dateKey, entry);
  });

  // 날짜순 정렬
  const combined = Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  // 과거 데이터의 마지막 지점을 찾아 예측 데이터와 연결
  const lastHistoricalIndex = combined.findLastIndex(d => d.historical != null);
  if (lastHistoricalIndex !== -1 && combined[lastHistoricalIndex]) {
    combined[lastHistoricalIndex].predicted = combined[lastHistoricalIndex].historical;
  }

  return combined;
}, [chartData]);

console.log(chartData)
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <NavLink to={`/stocks/${stockId}`} className="block group">
        <div className="p-5">
          {/* ... (이 부분은 수정할 필요 없습니다) ... */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#fcf3f4] flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-[#C20E2F]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C20E2F] transition-colors">
                  {ticker}
                </h3>
                <span className="text-xs text-gray-500">Stock</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-50 rounded-full text-sm font-medium text-gray-700">
              {ratio*100}% 비중
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 flex items-center">
                시장가가
              </p>
              <p className={`text-lg font-semibold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                {formatNumber(returnRate)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">평균 ROC</p>
              <p className={`text-lg font-semibold ${isRocPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isRocPositive ? '+' : ''}{formatNumber(avgRoc)}%
              </p>
            </div>
          </div>
        </div>
      </NavLink>

      {showDetails && transformedData.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  interval="preserveStart"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={{ stroke: '#000000', strokeWidth: 1 }} 
                  tickLine={{ stroke: '#000000' }}
                  padding={{left: 10}}
                />
                <YAxis
                  axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                {/* 과거 데이터 라인: 이름을 "Actual"로 변경하고 점(dot)을 추가합니다. */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  name="실제 가격"
                  stroke="#000000" // 파란색으로 변경
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 }}
                />
                {/* 예측 데이터 라인: 이름을 "Prediction"으로 변경하고 점(dot)을 추가합니다. */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="예측 가격"
                  stroke="#C20E2F" // 주황색으로 변경
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#f97316', fill: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioItem;