import classes from "./StockItem.module.css";

function StockItem({ stock }) {
  return (
    <li className={classes.item}>
      <h3>
        {stock.name} ({stock.ticker})
      </h3>
      <p>Current Price: ${stock.price.toFixed(2)}</p>
      {stock.isMine && <p> My Stock</p>}
      {stock.isInterested && <p>Interested</p>}
    </li>
  );
}

export default StockItem;
