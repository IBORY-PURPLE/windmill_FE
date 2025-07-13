import PersonalNavigation from "../components/PersonalNavigation";
import { Outlet, json } from "react-router-dom";

function PersonalRoot() {
  return (
    <>
      <PersonalNavigation></PersonalNavigation>
      <Outlet></Outlet>
    </>
  );
}

export default PersonalRoot;

export async function loader({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const size = 50;

  const response = await fetch(
    `http://localhost:8080/stocks?page=${page}&size=${size}`
  );

  if (!response.ok) {
    throw json(
      { message: "주식 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const data = await response.json();

  return {
    stocks: data.stocks,
    totalPages: data.totalPages,
    page,
  };
}
