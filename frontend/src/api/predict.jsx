import { API_BASE } from "../apiBase";

// 더미 데이터를 생성하는 헬퍼 함수
const generateDummyPrediction = (period) => {
  console.log(
    `API 호출 실패 또는 빈 응답. 기간 ${period}일의 더미 데이터를 생성합니다.`
  );
  const numPeriod = parseInt(period, 10);
  const predictionArray = [];
  const today = new Date();

  for (let i = 0; i < numPeriod; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i + 1); // 내일부터 시작

    const date = futureDate.toISOString().split("T")[0];
    const predictedValue = 1000 + Math.random() * 200 - 100;
    const typeValue = 4000 + Math.random() * 1000 - 500;

    predictionArray.push({
      date: date,
      data: predictedValue,
      type: typeValue,
    });
  }
  return { data: predictionArray };
};

export async function predictStock({ stockId, selectedKeys, period }) {
  const body = {
    stock_id: stockId,
    start: selectedKeys.includes("openingPrice"),
    high: selectedKeys.includes("highPrice"),
    low: selectedKeys.includes("lowPrice"),
    volume: selectedKeys.includes("volume"),
    fixed_rate: selectedKeys.includes("interestRate"),
    per: selectedKeys.includes("per"),
    pbr: selectedKeys.includes("pbr"),
    psr: selectedKeys.includes("psr"),
    snp: selectedKeys.includes("snp"),
    roe: selectedKeys.includes("roe"),
    roa: selectedKeys.includes("roa"),
    opm: selectedKeys.includes("opm"),
    npm: selectedKeys.includes("npm"),
    period: parseInt(period),
  };

  try {
    const res = await fetch(`${API_BASE}/predict/${stockId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // 응답이 성공적이지 않으면 에러를 발생시켜 catch 블록으로 보냄
    if (!res.ok) {
      throw new Error(`HTTP 에러! 상태 코드: ${res.status}`);
    }

    const responseData = await res.json();

    // 응답은 성공했지만 데이터가 비어있거나 형식이 다른 경우
    if (!responseData || !responseData.data || responseData.data.length === 0) {
      return generateDummyPrediction(period);
    }

    // 모든 것이 정상이면 실제 데이터를 반환
    return responseData;
  } catch (error) {
    console.error("API 예측 호출 실패:", error);
    // 어떤 종류의 에러든 발생하면 더미 데이터를 반환
    return generateDummyPrediction(period);
  }
}
