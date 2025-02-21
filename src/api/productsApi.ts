import { fetchApiWrapper } from "./helpers";

export type Product = {
  category_id: number;
  description: string;
  id: number;
  name: string;
};

export type ProductImage = {
  id: number;
  image_name: string;
  image_url: string;
  product_id: number;
};

export type ProductVariation = {
  id: number;
  price: number;
  product_id: number;
  stock: number;
};

export type ProductVariationPropertyValue = {
  id: number;
  product_variation_id: number;
  product_variation_property_id: number;
  product_variation_property_list_value_id: number;
  value_float: number;
  value_int: number;
  value_string: string;
};

export type ProductVariationPropertyListValue = {
  id: number;
  product_variation_property_id: number;
  value: string;
};

export type ProductVariationProperty = {
  id: number;
  name: string;
  type: number;
};

export const getProducts = (): Promise<Product[]> =>
  fetchApiWrapper({ path: "/Products" });

export const getProductById = (id: number): Promise<Product> =>
  fetchApiWrapper({ path: `/Products/${id}` });

export const getProductImage = (productId: number): Promise<ProductImage[]> =>
  fetchApiWrapper({
    path: "/ProductImages",
    params: `filter={"product_id":${productId}}`,
  });

export const getProductVariations = (
  productId: number
): Promise<ProductVariation[]> =>
  fetchApiWrapper({
    path: "/ProductVariations",
    params: `filter={"product_id":${productId}}`,
  });

// все возможные свойства
export const getProductVariationProperty = (
  propertyId: number
): Promise<ProductVariationProperty> =>
  fetchApiWrapper({
    path: `/ProductVariationProperties/${propertyId}`,
  });

export const getProductVariationPropertyListValue = (
  listValueId?: number
): Promise<ProductVariationPropertyListValue> =>
  fetchApiWrapper({
    path: `/ProductVariationPropertyListValues/${listValueId}`,
  });

// список свойств по айдишнику варианта продукта
export const getProductVariationPropertyValues = (
  productVariationIds: number[]
): Promise<ProductVariationPropertyValue[]> =>
  fetchApiWrapper({
    path: `/ProductVariationPropertyValues`,
    params: `filter={"product_variation_id":[${productVariationIds}]}`,
  });

export const getProductsByCategoryId = (
  categoryId: number
): Promise<Product[]> =>
  fetchApiWrapper({
    path: "/Products",
    params: `filter={"category_id": ${categoryId}}`,
  });
