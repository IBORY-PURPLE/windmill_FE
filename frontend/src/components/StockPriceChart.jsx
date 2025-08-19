import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Bar,
  Customized,
} from "recharts";
import dayjs from "dayjs";

// 캔들 컴포넌트는 수정할 필요 없습니다.
function Candle({ x, y, width, payload, yAxis }) {
  // ... (기존 Candle 컴포넌트 코드)
  const { open, close, high, low } = payload;
  if (open == null || close == null || high == null || low == null) return null;

  // y축 스케일 접근
  const yScale = yAxis.scale;
  const top = yScale(Math.max(open, close));
  const bottom = yScale(Math.min(open, close));
  const wickTop = yScale(high);
  const wickBottom = yScale(low);

  const candleWidth = Math.max(2, width * 0.6);
  const cx = x + width / 2;
  const isUp = close >= open;

  return (
    <g>
      {/* wick */}
      <line
        x1={cx}
        x2={cx}
        y1={wickTop}
        y2={wickBottom}
        stroke="#333"
        strokeWidth={1}
      />
      {/* body */}
      <rect
        x={cx - candleWidth / 2}
        width={candleWidth}
        y={top}
        height={Math.max(1, bottom - top)}
        fill={isUp ? "#e54848" : "#1f7ae0"}
        stroke="#333"
        rx={1}
      />
    </g>
  );
}


export default function StockPriceChart({
  data,
  showCandle = false,
  showVolume = false,
}) {
  const hasOHLC = data?.length && data[0].open != null && data[0].high != null;

  // X축 날짜 포맷을 위한 함수
  const formatDate = (dateStr) => dayjs(dateStr).format("MM-DD");

  // Y축 숫자 포맷을 위한 함수 (예: 12000 -> 12k)
  const formatYAxis = (tick) => (tick > 1000 ? `${(tick / 1000).toFixed(0)}k` : tick);


  if (showCandle && hasOHLC) {
    return (
      <ResponsiveContainer width="95%" height={360}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* 👇 캔들 차트의 XAxis 스타일 적용 */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval="preserveStartEnd"
            minTickGap={30}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
            tickMargin={10}
          />

          {/* 👇 캔들 차트의 YAxis 스타일 적용 */}
          <YAxis
            yAxisId="price"
            domain={["auto", "auto"]}
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />

          {showVolume && <YAxis yAxisId="vol" orientation="right" hide />}
          <Tooltip labelFormatter={(dateStr) => dayjs(dateStr).format("YYYY-MM-DD")} />

          {showVolume && (
            <Bar yAxisId="vol" dataKey="volume" barSize={6} opacity={0.3} />
          )}

          {/* Customized 부분은 수정할 필요 없습니다. */}
          <Customized
            component={(props) => {
              // ... (기존 Customized 코드)
              const { xAxisMap, yAxisMap, formattedGraphicalItems } = props;
              const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
              const yAxis = yAxisMap["price"];
              const items = formattedGraphicalItems?.[0]?.props?.points ?? [];
              return (
                <g>
                  {items.map((pt, idx) => (
                    <Candle
                      key={idx}
                      {...pt}
                      payload={data[idx]}
                      yAxis={yAxis}
                    />
                  ))}
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // Close 라인차트(초기)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* 👇 라인 차트의 XAxis 스타일 적용 */}
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          interval="preserveStart"
          minTickGap={30}
          tick={{ fontSize: 15, fill: '#6b7280' }}
          axisLine={{ stroke: '#000000', strokeWidth: 1 }}
          tickLine={{ stroke: '#000000' }}
          padding={{ left: 20, right: 20 }}
          tickMargin={10}
        />

        {/* 👇 라인 차트의 YAxis 스타일 적용 */}
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={formatYAxis}
          tick={{ fontSize: 15, fill: '#6b7280' }}
          axisLine={{ stroke: '#000000', strokeWidth: 1 }}
          tickLine={false}
        />

        <Tooltip
          labelFormatter={(dateStr) => dayjs(dateStr).format("YYYY-MM-DD")}
        />
        <Line
          type="monotone"
          dataKey="data"
          name="종가"
          strokeWidth={2}
          dot={false}
          stroke="#d66369"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}