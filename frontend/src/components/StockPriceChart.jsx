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

function Candle({ x, y, width, payload, yAxis }) {
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

  if (showCandle && hasOHLC) {
    return (
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="price" domain={["auto", "auto"]} />
          {showVolume && <YAxis yAxisId="vol" orientation="right" hide />}
          <Tooltip />
          {showVolume && (
            <Bar yAxisId="vol" dataKey="volume" barSize={6} opacity={0.3} />
          )}
          <Customized
            component={(props) => {
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
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis
          dataKey="date"
          tickFormatter={(dateStr, index) => {
            const date = dayjs(dateStr);
            const prevDate = data?.[index - 1]
              ? dayjs(data[index - 1].date)
              : null;
            if (!prevDate || date.year() !== prevDate.year()) {
              return `${date.year()} ${date.month() + 1}`;
            }
            if (prevDate.month() !== date.month) {
              return `${date.month() + 1}`;
            }
          }}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip
          labelFormatter={(dateStr) => dayjs(dateStr).format("YYYY-MM-DD")}
        />
        <Line
          type="monotone"
          dataKey="data"
          name="종가"
          dot={false}
          stroke="#d66369"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
