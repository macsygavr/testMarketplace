import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./index.module.css";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import { Category, getCategories } from "../../api/categoriesApi";
import {
  getAllProducts,
  getProductImages,
  getProductVariations,
  Product,
  ProductImage,
  ProductVariation,
} from "../../api/productsApi";
import ProductCard from "./components/ProductCard/ProductCard";
import { getRandomDarkColor } from "./components/CategoryCard/helpers";
import PageTittle from "../../components/PageTittle/PageTittle";

const Main = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<Category[]>();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsImages, setProductsImages] = useState<ProductImage[]>([]);
  const [productsVariations, setProductsVariations] = useState<
    ProductVariation[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [startRange, setStartRange] = useState<number>(0);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const loadMoreProducts = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    getAllProducts(startRange, selectedCategory)
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevData) => [...prevData, ...data]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMoreProducts();
    // eslint-disable-next-line
  }, [startRange, selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setStartRange((prevStartRange) => prevStartRange + 16);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (products.length) {
      const productsIds = products
        ?.slice(startRange, startRange + 16)
        .map((item) => item.id);
      if (productsIds.length) {
        getProductImages(productsIds).then((data) =>
          setProductsImages((prev) => [...prev, ...data])
        );
        getProductVariations(productsIds).then((data) =>
          setProductsVariations((prev) => [...prev, ...data])
        );
      }
    }
  }, [products, startRange]);

  const colors = useMemo(
    () => (categories ?? []).map(() => getRandomDarkColor()),
    [categories]
  );

  const handleOnCategoryClick = (categoryId: number) => {
    setProducts([]);
    setStartRange(0);
    setHasMore(true);
    setSelectedCategory(categoryId);
  };

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
              onClick={() => handleOnCategoryClick(item.id)}
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
      <div ref={loaderRef} />
    </>
  );
};

export default Main;
