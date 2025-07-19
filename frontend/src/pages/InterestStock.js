import StockList from "../components/StockList";
import { json, useRouteLoaderData } from "react-router-dom";
import { getAuthToken } from "../util/auth";

function InterestStock() {
  const interestStocks = useRouteLoaderData("intereststock");
  return (
    <>
      <h1>Interest Stock</h1>
      <StockList
        stocks={interestStocks}
        basePath="/personal/intereststock"
      ></StockList>
    </>
  );
}

export async function loader() {
  const token = getAuthToken();
  const response = await fetch(
    "https://windmill-be-iqxx.onrender.com/user/interest",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    throw json({ message: "관심 종목 불러오기 실패" }, { status: 500 });
  }

  const data = await response.json();
  return data.data;
}
export default InterestStock;
