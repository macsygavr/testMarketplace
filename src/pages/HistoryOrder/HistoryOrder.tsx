import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { OrderItem } from "../Order/Order";
import HistoryOrderItem from "./components/HistoryOrderItem/HistoryOrderItem";
import {
  getProductImages,
  getProducts,
  getProductVariations,
} from "../../api/productsApi";
import {
  ChartItem,
  Product,
  ProductImage,
  ProductVariation,
} from "../../redux/types";

/** Страница подробной информации об истории заказа */
const HistoryOrder = () => {
  // получаем номер заказа
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [productList, setProductList] = useState<ChartItem[]>([]);
  const [products, setProducts] = useState<Product[]>();
  const [productsImages, setProductImages] = useState<ProductImage[]>();
  const [productsVariations, setProductVariations] =
    useState<ProductVariation[]>();

  // получаем оформленные в прошлом заказы из local storage и находим соответствующий номеру заказа из урла
  useEffect(() => {
    if (orderId) {
      const orderValues = localStorage.getItem("history");

      if (orderValues) {
        const parsedValues: OrderItem[] = JSON.parse(orderValues);
        const currentOrder = parsedValues.find(
          (item) => item.orderId === orderId
        );

        setProductList(currentOrder?.products ?? []);
      }
    }
  }, [orderId]);

  // получаем данные, фото и варианты для каждого продукта из заказа
  useEffect(() => {
    if (productList.length > 0) {
      const productIds = productList.map((item) => item.productId);
      getProducts(productIds).then(setProducts);
      getProductImages(productIds).then(setProductImages);
      getProductVariations(productIds).then(setProductVariations);
    }
  }, [productList]);

  return (
    <>
      <BackButton />
      <div className={css.pageTitleContainer}>
        <PageTittle title={`Заказ №${orderId}`} />
      </div>
      <PageTittle title={"Товары"} />
      <div className={css.listContainer}>
        {products &&
          productsImages &&
          productsVariations &&
          productList.map((item, index) => {
            const product = products.find((el) => el.id === item.productId);
            const image = productsImages.find(
              (el) => el.product_id === item.productId
            );
            const variation = productsVariations.find(
              (el) =>
                el.product_id === item.productId && el.id === item.variantId
            );

            return (
              <HistoryOrderItem
                key={`${item.productId}=${item.variantId}=${index}`}
                productName={product?.name}
                productVariationName={item.uniqProperties}
                productImage={image}
                productVariation={variation}
                count={item.count}
                // функция перехода на страницу соответствующего варианта товара
                onClick={() =>
                  navigate(`/product/${item.productId}/${item.variantId}`)
                }
              />
            );
          })}
      </div>
    </>
  );
};

export default HistoryOrder;
