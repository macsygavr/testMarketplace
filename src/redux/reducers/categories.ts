import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "../../api/categoriesApi";
import { Category } from "../types";

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
};

export const fetchCategories = createAsyncThunk<Category[]>(
  "fetchCategories",
  getCategories
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export default categoriesSlice.reducer;
