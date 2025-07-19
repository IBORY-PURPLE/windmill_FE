import StockList from "../components/StockList";
import DUMMY_STOCKS from "../data/stocks";
// import { useRouteLoaderData } from "react-router-dom";

function MyStock() {
  // const { stocks } = useRouteLoaderData("allstocks");
  // const mystocks = stocks.filter((stock) => stock.isMine);
  const mystocks = DUMMY_STOCKS.filter((stock) => stock.isMine);

  return (
    <>
      <h1>My Stock</h1>
      <StockList stocks={mystocks}></StockList>
    </>
  );
}

export default MyStock;
