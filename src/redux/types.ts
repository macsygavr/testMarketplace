export interface Category {
  id: number;
  name: string;
  parent_id: number;
};

export interface Product {
  category_id: number;
  description: string;
  id: number;
  name: string;
};

export interface ProductImage {
  id: number;
  image_name: string;
  image_url: string;
  product_id: number;
};

export interface ProductVariation {
  id: number;
  price: number;
  product_id: number;
  stock: number;
};

export interface ProductVariationPropertyValue {
  id: number;
  product_variation_id: number;
  product_variation_property_id: number;
  product_variation_property_list_value_id: number;
  value_float: number;
  value_int: number;
  value_string: string;
};

export interface ProductVariationPropertyListValue {
  id: number;
  product_variation_property_id: number;
  value: string;
};

export interface ProductVariationProperty {
  id: number;
  name: string;
  type: number;
};

export interface ChartItem {
  productId: number;
  variantId: number;
  priceForItem: number;
  count?: number;
  uniqProperties?: string[];
};
