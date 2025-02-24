import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import ChartSummaryImage from "../../assets/icons/ChartSummaryImage";
import ChartListItem from "./components/ChartListItem/ChartListItem";
import { getProductImages, getProducts } from "../../api/productsApi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Product, ProductImage } from "../../redux/types";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { resetChart } from "../../redux/reducers/chart";
import { useSelector } from "react-redux";

/** Страница корзины */
const Chart = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { chart, totalPrice } = useSelector((state: RootState) => state.chart);

  const [products, setProducts] = useState<Product[]>();
  const [productsImages, setProductImages] = useState<ProductImage[]>();

  // получаем данные о товаре и изображения для всех товаров из корзины
  useEffect(() => {
    if (chart.length > 0) {
      const productIds = chart.map((item) => item.productId);
      getProducts(productIds).then(setProducts);
      getProductImages(productIds).then(setProductImages);
    }
  }, [chart]);

  // функция полной очистки корзины
  const handleClearChart = () => dispatch(resetChart());

  // функция перехода на страницу оформления заказа
  const handleOrderButtonClick = () => {
    navigate("/order");
  };

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
                disabled={totalPrice === 0}
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
          {!chart.length && "Здесь пока пусто"}
          {products &&
            productsImages &&
            chart.map((item, index) => {
              const product = products.find((el) => el.id === item.productId);
              const image = productsImages.find(
                (el) => el.product_id === item.productId
              );

              return (
                <ChartListItem
                  key={`${item.productId}=${item.variantId}=${index}`}
                  chartItem={item}
                  productName={product?.name}
                  productImage={image}
                  // функция перехода на страницу подробной информации о конкретном варианте товара
                  onClick={() =>
                    navigate(`/product/${item.productId}/${item.variantId}`)
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
