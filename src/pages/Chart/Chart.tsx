import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import ChartSummaryImage from "../../assets/icons/ChartSummaryImage";
import { ChartItem } from "../../api/helpers";
import ChartListItem from "./components/ChartListItem/ChartListItem";
import {
  getProductImages,
  getProducts,
  getProductVariations,
  Product,
  ProductImage,
  ProductVariation,
} from "../../api/productsApi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const Chart = () => {
  const navigate = useNavigate();

  const [list, setList] = useState<ChartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>();
  const [productsImages, setProductImages] = useState<ProductImage[]>();
  const [productsVariations, setProductVariations] =
    useState<ProductVariation[]>();

  useEffect(() => {
    const chartValues = localStorage.getItem("chart");

    if (chartValues) {
      const parsedValues: ChartItem[] = JSON.parse(chartValues);

      const hashMap: Record<string, number> = {};

      parsedValues.forEach((item) => {
        const key = JSON.stringify(item);

        if (hashMap[key]) {
          hashMap[key] = hashMap[key] + 1;
        } else {
          hashMap[key] = 1;
        }
      });

      const resultArr: ChartItem[] = [];

      for (let key in hashMap) {
        resultArr.push({
          ...JSON.parse(key),
          count: hashMap[key],
        });
      }

      setList(resultArr);
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      const productIds = list.map((item) => item.productId);
      getProducts(productIds).then(setProducts);
      getProductImages(productIds).then(setProductImages);
      getProductVariations(productIds).then(setProductVariations);
    }
  }, [list]);

  useEffect(() => {
    if (list && productsVariations) {
      const prices = list.map((item) => {
        const price = productsVariations.find(
          (el) => el.id === item.variantId
        )?.price;

        return (price ?? 0) * (item.count ?? 0);
      });

      const total = (prices as number[]).reduce((acc, item) => acc + item, 0);

      setTotalPrice(total);
    }
  }, [list, productsVariations]);

  const handleClearChart = () => {
    localStorage.removeItem("chart");
    setList([]);
  };

  const handleUpdatePrice = (price: number) => {
    setTotalPrice(price);
  };

  const handleOrderButtonClick = () => {
    navigate("/order");
  };

  const handleGoToProductPage = ({
    productId,
    variantId,
  }: {
    productId: number;
    variantId: number;
  }) => {
    navigate(`/product/${productId}/${variantId}`);
  };

  const disableOrderButton = totalPrice === 0;

  return (
    <>
      <div className={css.pageHeaderContainer}>
        <PageTittle title="Корзина" />
        <button className={css.clearBtn} onClick={handleClearChart}>
          Очистить корзину
        </button>
      </div>
      <div className={css.chartContainer}>
        <div className={css.summaryContainer}>
          <div className={css.summaryInfoContainer}>
            <div className={css.priceContainer}>
              <div className={css.priceTitle}>Стоимость корзины:</div>
              <div
                className={css.price}
              >{`${totalPrice?.toLocaleString()} ₽`}</div>
            </div>
            <div className={css.orderBtnContainer}>
              <Button
                disabled={disableOrderButton}
                onClick={handleOrderButtonClick}
              >
                Оформить
              </Button>
            </div>
          </div>
          <div className={css.summaryImage}>
            <ChartSummaryImage />
          </div>
        </div>
        <div className={css.chartListContainer}>
          {products &&
            productsImages &&
            productsVariations &&
            list.map((item, index) => {
              const product = products.find((el) => el.id === item.productId);
              const image = productsImages.find(
                (el) => el.product_id === item.productId
              );
              const variation = productsVariations.find(
                (el) =>
                  el.product_id === item.productId && el.id === item.variantId
              );

              return (
                <ChartListItem
                  key={`${item.productId}=${item.variantId}=${index}`}
                  chartItem={item}
                  product={product}
                  productImage={image}
                  productVariation={variation}
                  totalPrice={totalPrice}
                  onUpdatePrice={handleUpdatePrice}
                  onClick={() =>
                    handleGoToProductPage({
                      productId: item.productId,
                      variantId: item.variantId,
                    })
                  }
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Chart;
