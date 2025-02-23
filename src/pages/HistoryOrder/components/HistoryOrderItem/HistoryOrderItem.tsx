import React, { FC } from "react";
import css from "./index.module.css";

type Props = {
  imageUrl: string;
  productName: string;
  productVariation: string;
  price: string;
  count: number;
  onClick: () => void;
};

const HistoryOrderItem: FC<Props> = ({
  imageUrl,
  productName,
  productVariation,
  price,
  count,
  onClick,
}) => {
  return (
    <div className={css.container}>
      <img src={imageUrl} alt="" />
      <div className={css.infoContainer}>
        <span className={css.productName}></span>
        <div className={css.productPriceCountContainer}>
          <span className={css.price}></span>
          <span className={css.count}></span>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrderItem;
