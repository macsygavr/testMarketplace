import React, { FC, useMemo } from "react";
import css from "./index.module.css";
import { ProductImage, ProductVariation } from "../../../../api/productsApi";
import { useNavigate } from "react-router-dom";
import { handleAddToChart } from "../../../../api/helpers";

type Props = {
  productId: number;
  productName: string;
  productImages: ProductImage[];
  productVariations: ProductVariation[];
};

const ProductCard: FC<Props> = ({
  productId,
  productName,
  productImages,
  productVariations,
}) => {
  const navigate = useNavigate();

  const lowerPriceVariation = useMemo(() => {
    return productVariations?.sort((a, b) => a.price - b.price)?.[0];
  }, [productVariations]);

  const lowerPrice = lowerPriceVariation?.price;

  const lowerPriceWithoutDiscount =
    lowerPrice && (lowerPrice + (lowerPrice / 100) * 10).toFixed(0);

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
              handleAddToChart({
                productId,
                variantId: lowerPriceVariation.id,
              });
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
