import { ORM, Model, fk, attr } from "redux-orm";

class Product extends Model {
  static modelName = "Product";
  static fields = {
    id: attr(),
    name: attr(),
    description: attr(),
    category_id: attr(),
  };
}

class ProductImage extends Model {
  static modelName = "ProductImage";
  static fields = {
    id: attr(),
    image_name: attr(),
    image_url: attr(),
    product: fk('Product', 'product_id'),
  };
}

export { Product, ProductImage };
export const orm = new ORM();
orm.register(Product, ProductImage);
