import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, ProductImage, ProductVariation } from "../types";
import {
  getAllProducts,
  getProductImages,
  getProductVariations,
} from "../../api/productsApi";

interface ProductsState {
  products: Product[];
  productsImages: ProductImage[];
  productsVariations: ProductVariation[];
  hasMore: boolean;
  loading: boolean;
  startRange: number;
}

const initialState: ProductsState = {
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
          // Фильтрация дублированных товаров
          const newProducts = action.payload.filter(
            (newProduct) =>
              !state.products.some((product) => product.id === newProduct.id)
          );
          state.products = [...state.products, ...newProducts];
        }
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        // Фильтруем фотографии, чтобы избежать дублирования
        const newImages = action.payload.filter(
          (newImage) =>
            !state.productsImages.some(
              (image) => image.product_id === newImage.product_id
            )
        );
        state.productsImages = [...state.productsImages, ...newImages];
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
