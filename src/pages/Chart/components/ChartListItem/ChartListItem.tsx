import React, { FC } from "react";
import css from "./index.module.css";
import MinusIcon from "../../../../assets/icons/MinusIcon";
import PlusIcon from "../../../../assets/icons/PlusIcon";
import TrashIcon from "../../../../assets/icons/TrashIcon";
import { ChartItem, ProductImage } from "../../../../redux/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import {
  addToChart,
  removeAllProductItemsFromChart,
  removeOneProductItemFromChart,
} from "../../../../redux/reducers/chart";

type Props = {
  chartItem: ChartItem;
  productName?: string;
  productImage?: ProductImage;
  onClick?: () => void;
};

/** Элемент корзины */
const ChartListItem: FC<Props> = ({
  chartItem,
  productName,
  productImage,
  onClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // добавляем в корзину еще одну единицу товара
  const handlePlus = () => {
    dispatch(addToChart(chartItem));
  };

  // удаляем из корзины одну единицу товара
  const handleMinus = () => {
    if ((chartItem.count ?? 0) > 0) {
      dispatch(removeOneProductItemFromChart(chartItem));
    }
  };

  // удаляем из корзины всю позицию целиком
  const handleDeleteItem = () => {
    dispatch(removeAllProductItemsFromChart(chartItem));
  };

  return (
    <div className={css.container}>
      <div className={css.leftContainer}>
        <div className={css.responsiveContainer}>
          <img
            onClick={onClick}
            className={css.img}
            src={productImage?.image_url}
            alt=""
          />
          <div className={css.productNameContainer} onClick={onClick}>
            <span className={css.name}>{productName}</span>
            <span className={css.variation}>{`${
              chartItem.uniqProperties?.join(" / ") ?? ""
            }`}</span>
          </div>
        </div>
      </div>
      <div className={css.responsiveContainer}>
        <div className={css.countContainer}>
          <div className={css.iconContainer} onClick={handleMinus}>
            <MinusIcon />
          </div>
          <span className={css.count}>{chartItem.count}</span>
          <div className={css.iconContainer} onClick={handlePlus}>
            <PlusIcon />
          </div>
        </div>
        <span className={css.price}>
          {(chartItem.priceForItem * (chartItem.count ?? 0)).toLocaleString()} ₽
        </span>
        <div className={css.trashIconContainer} onClick={handleDeleteItem}>
          <TrashIcon />
        </div>
      </div>
    </div>
  );
};

export default ChartListItem;
