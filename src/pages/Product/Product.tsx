import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  getProducts,
  getProductImages,
  Product as ProductType,
  ProductImage,
  getProductVariations,
  ProductVariation,
  getProductVariationPropertyValues,
  ProductVariationPropertyValue,
  ProductVariationProperty,
  ProductVariationPropertyListValue,
  getProductVariationPropertyListValues,
  getProductVariationProperties,
} from "../../api/productsApi";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import css from "./index.module.css";
import cn from "classnames";
import { handleAddToChart } from "../../api/helpers";
import { filterProperties, isProductVariantsEqual } from "./helpers";
import Button from "../../components/Button/Button";
import BackButton from "../../components/BackButton/BackButton";

export type ProductProperties = {
  productVariationid?: number;
  values: string[];
};

const Product = () => {
  const { id, variantId } = useParams();
  const productId = Number(id);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [product, setProduct] = useState<ProductType>();
  const [productImage, setProductImage] = useState<ProductImage[]>([]);
  const [productVariations, setProductVariations] =
    useState<ProductVariation[]>();
  const [selectedVariationId, setSelectedVariationId] = useState<number>();
  const [productVariationPropertyValues, setProductVariationPropertyValues] =
    useState<ProductVariationPropertyValue[]>();
  const [productVariationProperties, setProductVariationProperties] =
    useState<ProductVariationProperty[]>();
  const [
    productVariationPropertyListValues,
    setProductVariationPropertyListValues,
  ] = useState<ProductVariationPropertyListValue[]>();
  const [productIdenticalProperties, setProductIdenticalProperties] = useState<
    string[]
  >([]);
  const [productUniqProperties, setProductUniqProperties] = useState<
    ProductProperties[]
  >([]);

  useEffect(() => {
    getProducts([productId]).then((data) => setProduct(data?.[0] ?? {}));
    getProductImages([productId]).then(setProductImage);
    getProductVariations([productId]).then((data) => {
      setSelectedVariationId(variantId ? Number(variantId) : data?.[0]?.id);
      setProductVariations(data);
    });
  }, [productId, variantId]);

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

  useEffect(() => {
    if (productVariationPropertyValues) {
      const productVariationPropertyIds = productVariationPropertyValues.map(
        (item) => item.product_variation_property_id
      );
      getProductVariationProperties(productVariationPropertyIds).then(
        setProductVariationProperties
      );

      const productVariationPropertyListValuesIds =
        productVariationPropertyValues
          .filter((item) => item.product_variation_property_list_value_id)
          .map((item) => item.product_variation_property_list_value_id);

      getProductVariationPropertyListValues(
        productVariationPropertyListValuesIds
      ).then(setProductVariationPropertyListValues);
    }
  }, [productVariationPropertyValues]);

  useEffect(() => {
    if (
      productVariationPropertyValues &&
      productVariationPropertyListValues &&
      productVariationProperties &&
      productVariations
    ) {
      let productProperties: ProductProperties[] = productVariations.map(
        (item) => ({
          productVariationid: item.id,
          values: [],
        })
      );

      productVariationPropertyValues.forEach((item) => {
        const property = productVariationProperties.find(
          (el) => el.id === item.product_variation_property_id
        );

        let propertyValue;

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

      const uniqProperties = filterProperties({
        properties: productProperties,
        isUniq: true,
      });

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

  const isAllVariantsEqual = useMemo(() => {
    if (productVariationPropertyValues) {
      return isProductVariantsEqual(productVariationPropertyValues);
    }
  }, [productVariationPropertyValues]);

  const price = `${(
    productVariations?.find((item) => item.id === selectedVariationId)?.price ??
    0
  ).toLocaleString()}₽`;

  const selectedPropertyValues = productIdenticalProperties;

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
              {productImage?.map((item) => (
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
              {productImage?.map((item) => (
                <SwiperSlide key={item.id}>
                  <img src={item.image_url} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={css.infoContainer}>
            <div className={css.priceContainer}>
              <span className={css.price}>{price}&nbsp;</span>
              <span className={css.priceText}>за шт.</span>
            </div>
            <div className={css.productPropertiesContainer}>
              {selectedPropertyValues?.join(`\n`)}
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
                    const uniqProperties = productUniqProperties.find(
                      (item) => item.productVariationid === selectedVariationId
                    )?.values;
                    handleAddToChart({
                      productId: productId,
                      variantId: selectedVariationId,
                      uniqProperties,
                    });
                  }
                }}
              >
                В корзину за {price}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
