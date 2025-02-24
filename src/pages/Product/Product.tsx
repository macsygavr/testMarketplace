import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  getProductVariationPropertyValues,
  getProductVariationPropertyListValues,
  getProductVariationProperties,
  getProducts,
  getProductImages,
  getProductVariations,
} from "../../api/productsApi";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import css from "./index.module.css";
import cn from "classnames";
import { filterProperties, isProductVariantsEqual } from "./helpers";
import Button from "../../components/Button/Button";
import BackButton from "../../components/BackButton/BackButton";
import {
  ProductImage,
  ProductVariationPropertyListValue,
  ProductVariationPropertyValue,
  Product as ProductType,
  ProductVariationProperty,
  ProductVariation,
} from "../../redux/types";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { addToChart } from "../../redux/reducers/chart";

// сущность свойств товара - айдишник варианта товара и список его свойств в формате "имя: значение"
export type ProductProperties = {
  productVariationid?: number;
  values: string[];
};

/** Страница подробной информации о товаре */
const Product = () => {
  // получаем id товара и варианта из урла
  const { id, variantId: variantIdString } = useParams();
  const productId = Number(id);
  const variantId = Number(variantIdString);

  // получаем все нужные состояния из редакса
  const dispatch = useDispatch<AppDispatch>();
  const { products, productsImages, productsVariations } = useSelector(
    (state: RootState) => state.products
  );

  // стейт для карусели
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // стейты товаров
  const [product, setProduct] = useState<ProductType>();
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productVariations, setProductVariations] =
    useState<ProductVariation[]>();
  const [selectedVariationId, setSelectedVariationId] = useState<number>();

  // стейты свойств товаров
  const [productVariationPropertyValues, setProductVariationPropertyValues] =
    useState<ProductVariationPropertyValue[]>();
  const [productVariationProperties, setProductVariationProperties] =
    useState<ProductVariationProperty[]>();
  const [
    productVariationPropertyListValues,
    setProductVariationPropertyListValues,
  ] = useState<ProductVariationPropertyListValue[]>();

  // одинаковые свойства среди всех возможных вариантов товара
  const [productIdenticalProperties, setProductIdenticalProperties] = useState<
    string[]
  >([]);

  // уникальные свойства
  const [productUniqProperties, setProductUniqProperties] = useState<
    ProductProperties[]
  >([]);

  // получаем данные о товаре, изображения и варианты товара
  useEffect(() => {
    // ищем данные в сторе
    const product = products.find((item) => item.id === productId);
    const productImages = productsImages.filter(
      (item) => item.product_id === productId
    );
    const productVariations = productsVariations.filter(
      (item) => item.product_id === productId
    );

    // если есть в хранилище, устанавливаем как значение, а иначе загружаем заново
    if (product) {
      setProduct(product);
    } else {
      getProducts([productId]).then((data) => setProduct(data?.[0] ?? {}));
    }

    if (productImages.length) {
      setProductImages(productImages);
    } else {
      getProductImages([productId]).then(setProductImages);
    }

    if (productVariations.length) {
      setSelectedVariationId(variantId ? variantId : productVariations?.[0].id);
      setProductVariations(productVariations);
    } else {
      getProductVariations([productId]).then((data) => {
        setSelectedVariationId(variantId ? variantId : data?.[0]?.id);
        setProductVariations(data);
      });
    }
  }, [products, productsImages, productsVariations, productId, variantId]);

  // получаем все свойства для каждого из вариантов товара и сортируем
  useEffect(() => {
    if (productVariations) {
      const propertyIds = productVariations.map((item) => item.id);

      getProductVariationPropertyValues(propertyIds).then((data) => {
        const sortedData = data.sort(
          (a, b) =>
            a.product_variation_property_id - b.product_variation_property_id
        );
        setProductVariationPropertyValues(sortedData);
      });
    }
  }, [productVariations]);

  // получаем значения всех свойств для всех вариантов
  useEffect(() => {
    if (productVariationPropertyValues) {
      // получаем айдишники свойств для всех вариантов
      const productVariationPropertyIds = productVariationPropertyValues.map(
        (item) => item.product_variation_property_id
      );

      // запрашиваем нужные названия и типы свойств
      getProductVariationProperties(productVariationPropertyIds).then(
        setProductVariationProperties
      );

      // получаем айдишники для свойств которые нужно получить из справочников
      const productVariationPropertyListValuesIds =
        productVariationPropertyValues
          .filter((item) => item.product_variation_property_list_value_id)
          .map((item) => item.product_variation_property_list_value_id);

      // запрашиваем значения из справочников
      getProductVariationPropertyListValues(
        productVariationPropertyListValuesIds
      ).then(setProductVariationPropertyListValues);
    }
  }, [productVariationPropertyValues]);

  // когда получили все варианты продукта, значения, названия и типы свойств
  // и значения из справочников - собираем их в человекочитаемый вид
  useEffect(() => {
    if (
      productVariationPropertyValues &&
      productVariationPropertyListValues &&
      productVariationProperties &&
      productVariations
    ) {
      // коллекция свойств для каждого доступного варианта товара
      let productProperties: ProductProperties[] = productVariations.map(
        (item) => ({
          productVariationid: item.id,
          values: [],
        })
      );

      // итерируемся по каждому свойству всех вариантов товара
      productVariationPropertyValues.forEach((item) => {
        // находим наименование и тип данного свойства
        const property = productVariationProperties.find(
          (el) => el.id === item.product_variation_property_id
        );

        // значение свойства
        let propertyValue;

        // получаем значение свойства из соответствующего места исходя из типа свойства
        switch (property?.type) {
          case 0:
            propertyValue = item.value_string;
            break;

          case 1:
            propertyValue = item.value_float;
            break;

          case 2:
            propertyValue = item.value_float;
            break;

          case 3:
            propertyValue = productVariationPropertyListValues.find(
              (el) => el.id === item.product_variation_property_list_value_id
            )?.value;
            break;

          default:
            break;
        }

        // получаем наименования уже имеющихся свойств для того чтобы не дублировать строки,
        // а перечислить все значения для одного наименования через запятую
        const propertyNames = productProperties
          .find((el) => el.productVariationid === item.product_variation_id)
          ?.values?.map((item) => item.split(":")[0]);

        const productIndex = productProperties.findIndex(
          (el) => el.productVariationid === item.product_variation_id
        );

        if (property && propertyNames?.includes(property.name)) {
          const propertyIndex = propertyNames.findIndex(
            (item) => item.split(":")[0] === property.name
          );

          productProperties[productIndex].values[
            propertyIndex
          ] = `${productProperties[productIndex].values[propertyIndex]}, ${propertyValue}`;
        } else {
          productProperties[productIndex].values = [
            ...productProperties[productIndex].values,
            `${property?.name}: ${propertyValue}`,
          ];
        }
      });

      // получаем уникальные свойства для дальнейшей возможности выбора варианта пользователем
      const uniqProperties = filterProperties({
        properties: productProperties,
        isUniq: true,
      });

      // получаем одинаковые свойства для всех вариантов
      const identicalProperties = filterProperties({
        properties: productProperties,
        isUniq: false,
      });

      setProductUniqProperties(uniqProperties);
      setProductIdenticalProperties(identicalProperties?.[0]?.values);
    }
  }, [
    productVariationPropertyValues,
    productVariationPropertyListValues,
    productVariationProperties,
    productVariations,
  ]);

  // определяем все ли свойства у всех вариантов одинаковые
  // и в зависимости от этого отображаем/скрываем блок с выбором вариантов
  const isAllVariantsEqual = useMemo(() => {
    if (productVariationPropertyValues) {
      return isProductVariantsEqual(productVariationPropertyValues);
    }
  }, [productVariationPropertyValues]);

  // цена для выбранного варианта
  const price =
    productVariations?.find((item) => item.id === selectedVariationId)?.price ??
    0;

  const priceString = `${price.toLocaleString()}₽`;

  return (
    <>
      <BackButton />
      <div className={css.productContainer}>
        <span className={css.productName}>{product?.name}</span>
        <div className={css.detailInfoContainer}>
          <div className={css.carouselContainer}>
            <Swiper
              style={{
                // @ts-ignore
                "--swiper-navigation-color": "#D3D3D3",
                "--swiper-pagination-color": "#D3D3D3",
              }}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className={css.mySwiper}
            >
              {productImages?.map((item) => (
                <SwiperSlide key={item.id}>
                  <img src={item.image_url} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              // @ts-ignore
              onSwiper={setThumbsSwiper}
              slidesPerView={5}
              modules={[FreeMode, Navigation, Thumbs]}
              className={css.mySwiper2}
            >
              {productImages?.map((item) => (
                <SwiperSlide key={item.id}>
                  <img src={item.image_url} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={css.infoContainer}>
            <div className={css.priceContainer}>
              <span className={css.price}>{priceString}&nbsp;</span>
              <span className={css.priceText}>за шт.</span>
            </div>
            <div className={css.productPropertiesContainer}>
              {productIdenticalProperties?.join(`\n`)}
            </div>
            <div className={css.productVariationsSelector}>
              {!isAllVariantsEqual &&
                productUniqProperties?.map((item, index) => (
                  <div
                    key={`${item.productVariationid}-${index}`}
                    className={cn(
                      css.productVariation,
                      selectedVariationId === item.productVariationid &&
                        css.productVariationActive
                    )}
                    onClick={() =>
                      setSelectedVariationId(item.productVariationid)
                    }
                  >
                    {item.values.join(" / ")}
                  </div>
                ))}
            </div>
            <div className={css.btnContainer}>
              <Button
                onClick={() => {
                  if (selectedVariationId) {
                    // получаем уникальные свойства выбранного варианта товара
                    // и сохраняем в корзину для отображения в дальнейшем
                    const uniqProperties = productUniqProperties.find(
                      (item) => item.productVariationid === selectedVariationId
                    )?.values;

                    // добавляем товар в корзину
                    dispatch(
                      addToChart({
                        productId: productId,
                        variantId: selectedVariationId,
                        priceForItem: price,
                        uniqProperties,
                      })
                    );
                  }
                }}
              >
                В корзину за {priceString}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
