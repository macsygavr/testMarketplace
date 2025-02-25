import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, ProductImage, ProductVariation } from "../types";
import {
  getAllProducts,
  getProductImages,
  getProductVariations,
} from "../../api/productsApi";
import { orm } from "../models";

interface ProductsState {
  productsOrm: any;
  products: Product[];
  productsImages: ProductImage[];
  productsVariations: ProductVariation[];
  hasMore: boolean;
  loading: boolean;
  startRange: number;
}

const initialState: ProductsState = {
  productsOrm: orm.getEmptyState(),
  products: [],
  productsImages: [],
  productsVariations: [],
  hasMore: true,
  loading: false,
  startRange: 0,
};

export const fetchAllProducts = createAsyncThunk<
  Product[],
  { startRange: number; selectedCategory?: number }
>("fetchProducts", ({ startRange, selectedCategory }) =>
  getAllProducts(startRange, selectedCategory)
);

export const fetchProductImages = createAsyncThunk<ProductImage[], number[]>(
  "fetchProductImages",
  (productIds: number[]) => getProductImages(productIds)
);

export const fetchProductVariations = createAsyncThunk<
  ProductVariation[],
  number[]
>("fetchProductVariations", (productIds: number[]) =>
  getProductVariations(productIds)
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.productsOrm = orm.getEmptyState();
      state.products = [];
      state.productsImages = [];
      state.productsVariations = [];
      state.hasMore = true;
      state.startRange = 0;
    },
    incrementStartRange: (state) => {
      state.startRange = state.startRange + 16;
    },
    resetStartRange: (state) => {
      state.startRange = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.length) {
          state.hasMore = false;
        } else {
          // Нормализация данных
          const session = orm.session(state.productsOrm);
          action.payload.forEach((item) => {
            //@ts-ignore
            if (!session.Product.withId(item.id)) {
              //@ts-ignore
              session.Product.create(item);
            }
          });
          // Запись orm для примера его использования
          state.productsOrm = session.state;

          // Запись нормализованного "классического" массива продуктов
          const newProducts: Product[] = state.productsOrm.Product
            ? Object.values(state.productsOrm.Product.itemsById)
            : [];
          state.products = newProducts;
        }
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        // Нормализация данных
        const session = orm.session(state.productsOrm);
        action.payload.forEach((item) => {
          //@ts-ignore
          if (!session.ProductImage.withId(item.id)) {
            //@ts-ignore
            session.ProductImage.create(item);
          }
        });
        // Запись orm для примера его использования
        state.productsOrm = session.state;

        // Запись массива нормализованного "классического" массива изображений продуктов
        const productsImages: ProductImage[] = state.productsOrm.ProductImage
          ? Object.values(state.productsOrm.ProductImage.itemsById)
          : [];
        state.productsImages = productsImages;
      })
      .addCase(fetchProductVariations.fulfilled, (state, action) => {
        // Фильтруем варианты товаров, чтобы избежать дублирования
        const newVariations = action.payload.filter(
          (newVariation) =>
            !state.productsVariations.some(
              (variation) => variation.product_id === newVariation.product_id
            )
        );
        state.productsVariations = [
          ...state.productsVariations,
          ...newVariations,
        ];
      });
  },
});

export const { resetProducts, incrementStartRange, resetStartRange } =
  productsSlice.actions;
export default productsSlice.reducer;
