import React, { FC, useMemo } from "react";
import css from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { ProductImage, ProductVariation } from "../../../../redux/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import { addToChart } from "../../../../redux/reducers/chart";

type Props = {
  productId: number;
  productName: string;
  productImages: ProductImage[];
  productVariations: ProductVariation[];
};

/** Карточка товара */
const ProductCard: FC<Props> = ({
  productId,
  productName,
  productImages,
  productVariations,
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>()

  // находим вариант товара с наименьшей ценой
  const lowerPriceVariation = useMemo(() => {
    return productVariations?.sort((a, b) => a.price - b.price)?.[0];
  }, [productVariations]);

  // наименьшая возможная цена
  const lowerPrice = lowerPriceVariation?.price;

  // мок для отображения скидки
  const lowerPriceWithoutDiscount =
    lowerPrice && (lowerPrice + (lowerPrice / 100) * 10).toFixed(0);

  // функция перехода на страницу подробной информаии о товаре
  const handleGoToProductPage = () => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className={css.container} onClick={handleGoToProductPage}>
      <div className={css.upperBlock}>
        <img
          className={css.img}
          src={productImages?.[0]?.image_url}
          alt="Не удалось загрузить изображение"
        />
        <span className={css.productName}>{productName}</span>
      </div>
      <div>
        <div className={css.priceBlock}>
          <span className={css.minPrice}>От {lowerPrice} ₽</span>
          <div className={css.previousPriceBlock}>
            <span className={css.previousPrice}>
              {lowerPriceWithoutDiscount} ₽
            </span>
            <span className={css.discount}>-10%</span>
          </div>
        </div>
        <button
          className={css.button}
          onClick={(e) => {
            e.stopPropagation();
            if (lowerPriceVariation) {
              // добавляем товар в корзину (вариант с самой дешевой ценой)
              dispatch(addToChart({
                productId,
                variantId: lowerPriceVariation.id,
                priceForItem: lowerPriceVariation.price
              }))
            }
          }}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
