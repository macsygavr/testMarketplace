import React, { FC } from "react";
import css from "./index.module.css";
import { ProductImage, ProductVariation } from "../../../../api/productsApi";

type Props = {
  productName?: string;
  productImage?: ProductImage;
  productVariation?: ProductVariation;
  count?: number;
  onClick: () => void;
};

const HistoryOrderItem: FC<Props> = ({
  productImage,
  productName,
  productVariation,
  count,
  onClick,
}) => {
  return (
    <div className={css.container}>
      <img
        className={css.img}
        src={productImage?.image_url}
        alt=""
        onClick={onClick}
      />
      <div className={css.infoContainer}>
        <span className={css.productName} onClick={onClick}>
          {`${productName} (Вариант: ${productVariation?.id})`}
        </span>
        <div className={css.productPriceCountContainer}>
          <span
            className={css.price}
          >{`${productVariation?.price?.toLocaleString()}₽ / шт.`}</span>
          <span className={css.count}>{`${count} шт.`}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrderItem;
