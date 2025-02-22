import React, { useEffect, useMemo, useState } from "react";
import css from "./index.module.css";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import { Category, getCategories } from "../../api/categoriesApi";
import {
  getAllProducts,
  getProductImages,
  getProductsByCategoryId,
  getProductVariations,
  Product,
  ProductImage,
  ProductVariation,
} from "../../api/productsApi";
import ProductCard from "./components/ProductCard/ProductCard";
import { getRandomDarkColor } from "./components/CategoryCard/helpers";
import PageTittle from "../../components/PageTittle/PageTittle";

const Main = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [products, setProducts] = useState<Product[]>();
  const [productsImages, setProductsImages] = useState<ProductImage[]>();
  const [productsVariations, setProductsVariations] =
    useState<ProductVariation[]>();
  const [selectedCategory, setSelectedCategory] = useState<number>();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });

    getAllProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProductsByCategoryId(selectedCategory).then(setProducts);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (products) {
      const productsIds = products?.map((item) => item.id);
      getProductImages(productsIds).then(setProductsImages);
      getProductVariations(productsIds).then(setProductsVariations);
    }
  }, [products]);

  const colors = useMemo(
    () => (categories ?? []).map(() => getRandomDarkColor()),
    [categories]
  );

  return (
    <>
      <div className={css.categoriesBlock}>
        <PageTittle title="Категории товаров" />
        <div className={css.categoriesList}>
          {categories?.map((item, index) => (
            <CategoryCard
              key={item.id}
              categoryName={item.name}
              color={colors[index]}
              onClick={() => setSelectedCategory(item.id)}
            />
          ))}
        </div>
      </div>
      <div className={css.productsList}>
        {!((products ?? []).length > 0) && (
          <span className={css.noProductsMessage}>
            В этой категории пока товаров нет
          </span>
        )}
        {productsImages &&
          productsVariations &&
          products?.map((item) => {
            const images = productsImages.filter(
              (el) => el.product_id === item.id
            );
            const variations = productsVariations.filter(
              (el) => el.product_id === item.id
            );

            return (
              <ProductCard
                key={item.id}
                productId={item.id}
                productName={item.name}
                productImages={images}
                productVariations={variations}
              />
            );
          })}
      </div>
    </>
  );
};

export default Main;
