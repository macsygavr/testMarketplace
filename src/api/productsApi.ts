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

export const getProducts = (): Promise<Product[]> =>
  fetchApiWrapper({ path: "/Products"});

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

export const getProductVariationProperties = () =>
  fetchApiWrapper({
    path: `/ProductVariationProperties`,
  });

export const getProductsByCategoryId = (
  categoryId: number
): Promise<Product[]> =>
  fetchApiWrapper({
    path: "/Products",
    params: `filter={"category_id": ${categoryId}}`,
  });
