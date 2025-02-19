import React, { useEffect, useMemo, useState } from "react";
import css from "./index.module.css";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import { Category, getCategories } from "../../api/categoriesApi";
import {
  getProducts,
  getProductsByCategoryId,
  Product,
} from "../../api/productsApi";
import ProductCard from "./components/ProductCard/ProductCard";
import { getRandomDarkColor } from "./components/CategoryCard/helpers";

const Main = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [products, setProducts] = useState<Product[]>();
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const colors = useMemo(
    () => (categories ?? []).map(() => getRandomDarkColor()),
    [categories]
  );

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });

    getProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProductsByCategoryId(selectedCategory).then((data) =>
        setProducts(data)
      );
    }
  }, [selectedCategory]);

  const handleAddToChart = (id: number) => {
    const preparedId = String(id);

    if (localStorage.getItem("chart")) {
      localStorage.setItem(
        "chart",
        JSON.stringify([
          ...[...JSON.parse(localStorage.getItem("chart") ?? "")],
          preparedId,
        ])
      );
    } else {
      localStorage.setItem("chart", JSON.stringify([preparedId]));
    }
  };

  return (
    <div className={css.container}>
      <div className={css.categoriesBlock}>
        <div className={css.title}>Категории товаров</div>
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
        {products?.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            onClick={() => handleAddToChart(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Main;
