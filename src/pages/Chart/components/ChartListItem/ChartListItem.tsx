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

const ChartListItem: FC<Props> = ({
  chartItem,
  product,
  productImage,
  productVariation,
  totalPrice,
  onUpdatePrice,
  onClick,
}) => {
  const [count, setCount] = useState<number>(chartItem.count ?? 1);
  const productVariationPrice = productVariation?.price;

  const handlePlus = () => {
    setCount((old) => old + 1);
    handleAddToChart(chartItem);
    onUpdatePrice((totalPrice ?? 0) + (productVariationPrice ?? 0));
  };

  const handleMinus = () => {
    if (count > 0) {
      setCount((old) => old - 1);
      handleRemoveOnePieceFromChart(chartItem);
      onUpdatePrice((totalPrice ?? 0) - (productVariationPrice ?? 0));
    }
  };

  const handleDeleteItem = () => {
    setCount(0);
    handleRemoveAllPiecesFromChart(chartItem);
    onUpdatePrice((totalPrice ?? 0) - (productVariationPrice ?? 0) * count);
  };

  return (
    <div className={css.container}>
      <div className={css.leftContainer}>
        <img
          onClick={onClick}
          className={css.img}
          src={productImage?.image_url}
          alt=""
        />
        <div className={css.productNameContainer} onClick={onClick}>
          <span className={css.name}>{product?.name}</span>
          <span
            className={css.variation}
          >{`Вариант: ${productVariation?.id}`}</span>
        </div>
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
      </div>
      <div className={css.iconContainer} onClick={handleDeleteItem}>
        <TrashIcon />
      </div>
    </div>
  );
};

export default ChartListItem;
