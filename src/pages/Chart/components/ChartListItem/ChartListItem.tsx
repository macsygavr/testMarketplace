import React, { FC } from "react";
import css from "./index.module.css";
import TrashIcon from "../../../../assets/icons/TrashIcon";
import { ChartItem, ProductImage } from "../../../../redux/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import { removeAllProductItemsFromChart } from "../../../../redux/reducers/chart";
import ProductChartController from "../../../../components/ProductChartController/ProductChartController";

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
        <ProductChartController chartItem={chartItem} />
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
