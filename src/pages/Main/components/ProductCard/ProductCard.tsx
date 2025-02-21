import React, { FC, useEffect, useMemo, useState } from "react";
import css from "./index.module.css";
import {
  getProductImage,
  getProductVariations,
  ProductImage,
  ProductVariation,
} from "../../../../api/productsApi";
import { useNavigate } from "react-router-dom";
import { handleAddToChart } from "../../../../api/helpers";

type Props = {
  id: number;
  name: string;
};

const ProductCard: FC<Props> = ({ id, name }) => {
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState<ProductImage[]>();
  const [productVariations, setProductVariations] =
    useState<ProductVariation[]>();

  useEffect(() => {
    getProductImage(id).then((data) => setProductImage(data));
    getProductVariations(id).then((data) => setProductVariations(data));
  }, [id]);

  const lowerPriceVariation = useMemo(() => {
    return productVariations?.sort((a, b) => a.price - b.price)?.[0];
  }, [productVariations]);

  const lowerPrice = lowerPriceVariation?.price;

  const lowerPriceWithoutDiscount =
    lowerPrice && (lowerPrice + (lowerPrice / 100) * 10).toFixed(0);

  const handleGoToProductPage = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={css.container} onClick={handleGoToProductPage}>
      <div className={css.upperBlock}>
        <img
          className={css.img}
          src={productImage?.[0].image_url}
          alt="Не удалось загрузить изображение"
        />
        <span className={css.productName}>{name}</span>
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
                productId: id,
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
