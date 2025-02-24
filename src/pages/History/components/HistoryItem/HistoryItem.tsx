import React, { FC } from "react";
import css from "./index.module.css";

type Props = {
  orderDate: string;
  orderId: string;
  productsCount: number;
  totalPrice: number;
  address: string;
  onClick: (id: string) => void;
};

/** Элемент истории */
const HistoryItem: FC<Props> = ({
  orderDate,
  orderId,
  productsCount,
  totalPrice,
  address,
  onClick,
}) => {

  return (
    <div className={css.container} onClick={() => onClick(orderId)}>
      <div className={css.block}>
        <span className={css.title}>Дата заказа</span>
        <span className={css.value}>{orderDate}</span>
      </div>
      <div className={css.block}>
        <span className={css.title}>Номер заказа</span>
        <span className={css.value}>#{orderId}</span>
      </div>
      <div className={css.horisontalBlockContainer}>
        <div className={css.block}>
          <span className={css.title}>Кол-во товаров</span>
          <span className={css.value}>{productsCount} шт.</span>
        </div>
        <div className={css.block}>
          <span className={css.title}>Стоимость заказа</span>
          <span className={css.value}>{totalPrice.toLocaleString()}₽</span>
        </div>
        <div className={css.block}>
          <span className={css.title}>Адрес доставки</span>
          <span className={css.value}>{address}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
