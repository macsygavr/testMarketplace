import React, { FC } from "react";
import css from "./index.module.css";
import MinusIcon from "../../assets/icons/MinusIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import {
  addToChart,
  removeAllProductItemsFromChart,
  removeOneProductItemFromChart,
} from "../../redux/reducers/chart";
import { ChartItem } from "../../redux/types";

type Props = {
  chartItem: ChartItem;
};

const ProductChartController: FC<Props> = ({ chartItem }) => {
  const dispatch = useDispatch<AppDispatch>();

  // добавляем в корзину еще одну единицу товара
  const handlePlus = () => {
    dispatch(addToChart(chartItem));
  };

  // удаляем из корзины одну единицу товара
  const handleMinus = () => {
    if ((chartItem.count ?? 0) === 1) {
      dispatch(removeAllProductItemsFromChart(chartItem));
    } else {
      dispatch(removeOneProductItemFromChart(chartItem));
    }
  };

  return (
    <div className={css.countContainer}>
      <div className={css.iconContainer} onClick={handleMinus}>
        <MinusIcon />
      </div>
      <span className={css.count}>{chartItem.count}</span>
      <div className={css.iconContainer} onClick={handlePlus}>
        <PlusIcon />
      </div>
    </div>
  );
};

export default ProductChartController;
