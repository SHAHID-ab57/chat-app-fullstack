import { configureStore, } from "@reduxjs/toolkit";
import authReducer from "../Slice/AuthSlice"
import searchReducer from "../Slice/SearchSlice"

export const Store = configureStore({
    reducer:{
    AuthStore:authReducer,
    searchStore:searchReducer
    }
})