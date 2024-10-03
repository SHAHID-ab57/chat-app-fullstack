import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosIntance from "../../Api/AxiosIntance";
import { api_endpoint } from "../../Api/ApiHandler";

export const SearchApi = createAsyncThunk(
  "search/SearchApi",
  async (data, { rejectWithValue }) => {
    try {
      const searchPayload = { search: data };
    //   console.log("Payload sent to server:", JSON.stringify(searchPayload))
      
      const response = await AxiosIntance.post(
        api_endpoint.searchuser,
        searchPayload
      );
      console.log("Search response:", response);
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    searchResult: [],
    isLoading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(SearchApi.pending, (state) => {
        (state.isLoading = true), (state.error = null);
      })
      .addCase(SearchApi.fulfilled, (state, action) => {
        (state.isLoading = false), (state.searchResult = action.payload);
      })
      .addCase(SearchApi.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.payload);
      });
  },
});

export default searchSlice.reducer;
