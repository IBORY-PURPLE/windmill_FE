import { useLocation } from "react-router-dom";
import DUMMY_STOCKS from "../data/stocks";
import StockList from "../components/StockList";
function PersonalPage() {
  const query = new URLSearchParams(useLocation().search);
  const filter = query.get("filter") || "all";

  const filtered =
    {
      all: DUMMY_STOCKS,
      mystock: DUMMY_STOCKS.filter((s) => s.isMine),
      interest: DUMMY_STOCKS.filter((s) => s.isInterested),
    }[filter] || DUMMY_STOCKS;

  return (
    <>
      <h1>MyStock</h1>
      <StockList stocks={filtered}></StockList>
    </>
  );
}

export default PersonalPage;
