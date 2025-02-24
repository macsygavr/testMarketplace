import {
  Product,
  ProductImage,
  ProductVariation,
  ProductVariationProperty,
  ProductVariationPropertyListValue,
  ProductVariationPropertyValue,
} from "../redux/types";
import { fetchApiWrapper } from "./helpers";

export const getAllProducts = (
  startRange: number,
  categoryId?: number
): Promise<Product[]> =>
  fetchApiWrapper({
    path: "/Products",
    params: `${
      categoryId ? `filter={"category_id": ${categoryId}}&` : ""
    }range=[${startRange},${startRange + 15}]`,
  });

export const getProducts = (productIds?: number[]): Promise<Product[]> =>
  fetchApiWrapper({
    path: "/Products",
    params: `filter={"id":[${productIds}]}&range=[0,15]`,
  });

export const getProductImages = (
  productIds: number[]
): Promise<ProductImage[]> =>
  fetchApiWrapper({
    path: "/ProductImages",
    params: `filter={"product_id":[${productIds}]}`,
  });

export const getProductVariations = (
  productIds: number[]
): Promise<ProductVariation[]> =>
  fetchApiWrapper({
    path: "/ProductVariations",
    params: `filter={"product_id":[${productIds}]}`,
  });

// все возможные свойства
export const getProductVariationProperties = (
  variationPropertyIds: number[]
): Promise<ProductVariationProperty[]> =>
  fetchApiWrapper({
    path: `/ProductVariationProperties`,
    params: `filter={"id":[${variationPropertyIds}]}`,
  });

export const getProductVariationPropertyListValues = (
  listValueIds?: number[]
): Promise<ProductVariationPropertyListValue[]> =>
  fetchApiWrapper({
    path: `/ProductVariationPropertyListValues`,
    params: `filter={"id":[${listValueIds}]}`,
  });

// список свойств по айдишнику варианта продукта
export const getProductVariationPropertyValues = (
  productVariationIds: number[]
): Promise<ProductVariationPropertyValue[]> =>
  fetchApiWrapper({
    path: `/ProductVariationPropertyValues`,
    params: `filter={"product_variation_id":[${productVariationIds}]}`,
  });
