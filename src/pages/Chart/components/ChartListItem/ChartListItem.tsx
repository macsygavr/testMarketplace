import React, { FC, useState } from "react";
import css from "./index.module.css";
import {
  Product,
  ProductImage,
  ProductVariation,
} from "../../../../api/productsApi";
import {
  ChartItem,
  handleAddToChart,
  handleRemoveAllPiecesFromChart,
  handleRemoveOnePieceFromChart,
} from "../../../../api/helpers";
import MinusIcon from "../../../../assets/icons/MinusIcon";
import PlusIcon from "../../../../assets/icons/PlusIcon";
import TrashIcon from "../../../../assets/icons/TrashIcon";

type Props = {
  chartItem: ChartItem;
  product?: Product;
  productImage?: ProductImage;
  productVariation?: ProductVariation;
  totalPrice?: number;
  onUpdatePrice: (price: number) => void;
  onClick?: () => void;
};

/** Элемент корзины */
const ChartListItem: FC<Props> = ({
  chartItem,
  product,
  productImage,
  productVariation,
  totalPrice,
  onUpdatePrice,
  onClick,
}) => {
  // количество товара в корзине
  const [count, setCount] = useState<number>(chartItem.count ?? 1);
  const productVariationPrice = productVariation?.price;

  // добавляем в корзину еще одну единицу товара
  const handlePlus = () => {
    setCount((old) => old + 1);
    handleAddToChart(chartItem);
    onUpdatePrice((totalPrice ?? 0) + (productVariationPrice ?? 0));
  };

  // удаляем из корзины одну единицу товара
  const handleMinus = () => {
    if (count > 0) {
      setCount((old) => old - 1);
      handleRemoveOnePieceFromChart(chartItem);
      onUpdatePrice((totalPrice ?? 0) - (productVariationPrice ?? 0));
    }
  };

  // удаляем из корзины всю позицию целиком
  const handleDeleteItem = () => {
    setCount(0);
    handleRemoveAllPiecesFromChart(chartItem);
    onUpdatePrice((totalPrice ?? 0) - (productVariationPrice ?? 0) * count);
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
            <span className={css.name}>{product?.name}</span>
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
          <span className={css.count}>{count}</span>
          <div className={css.iconContainer} onClick={handlePlus}>
            <PlusIcon />
          </div>
        </div>
        <span className={css.price}>
          {productVariation &&
            `${(productVariation?.price * count).toLocaleString()} ₽`}
        </span>
        <div className={css.trashIconContainer} onClick={handleDeleteItem}>
          <TrashIcon />
        </div>
      </div>
    </div>
  );
};

export default ChartListItem;
