import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_endpoint,  } from "../../Api/ApiHandler";
import axios from "axios";
import AxiosIntance from "../../Api/AxiosIntance";


export const RegisterAuth = createAsyncThunk(
  "auth/RegisterAuth",
  async (data,{rejectWithValue}) => {
    try {
        // console.log('Sending data:', data); // Log the data
        const response = await AxiosIntance.post(api_endpoint.register, data);
        // console.log('Response:', response);
        return response.data;
      } catch (error) {
        // console.error('Error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
  }
);

export const EmailAuth = createAsyncThunk(
  "auth/EmailAuth",
  async (emailData, { rejectWithValue }) => {
    try {
      // console.log('Sending email data:', emailData); // Log the email data
      const response = await AxiosIntance.post(api_endpoint.email, emailData);
      // console.log('Response:', response);
      return response.data;
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const PasswordAuth = createAsyncThunk(
  "auth/PasswordAuth",
  async (passwordData, { rejectWithValue }) => {
    try {
      // console.log('Sending password data:', passwordData); // Log the password data
      const response = await AxiosIntance.post(api_endpoint.password, passwordData,{ withCredentials: true });
      // console.log('Response:', response);
      return response.data;
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const FetchUserDetails = createAsyncThunk(
  "auth/FetchUserDetails",
  async () => {
    try {
      
      const response = await AxiosIntance.get(
        api_endpoint.user,
        { withCredentials: true } 
      );
      // console.log('Response:', response);
      return response.data;
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const UpdateUserDetails = createAsyncThunk(
  "auth/UpdateUserDetails",
  async (updatedData, { rejectWithValue }) => {
    try {
      // console.log('Updating user data:', updatedData); // Log the updated data
      const response = await AxiosIntance.post(
        api_endpoint.updateUser, 
        updatedData,
        { withCredentials: true }
      );
      // console.log('Response:', response);
      return response.data;
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const LogoutAuth = createAsyncThunk(
  "auth/LogoutAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosIntance.get(api_endpoint.logout, {}, { withCredentials: true });
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Forgot Email Verification (Step 1)
export const ForgotEmailAuth = createAsyncThunk(
  "auth/ForgotEmailAuth",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await AxiosIntance.post(api_endpoint.forgotemail, emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Reset Password (Step 2)
export const ResetPasswordAuth = createAsyncThunk(
  "auth/ResetPasswordAuth",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await AxiosIntance.post(api_endpoint.forgotpassword, passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const AuthSlicer = createSlice({
  name: "auth",
  initialState: {
    status: 0,
    error: null,
    user: null,
    emailInfo: null,
    passwordInfo: null,
    forgotEmailInfo: null,  
    resetPasswordInfo: null, 
    userDetails: null,
    onlineUser: [],
    socketConnection: false,

  },
  reducers: {
   onlineUserArray:(state,action) => {
     state.onlineUser = action.payload
   },
    SetsocketConnection:(state,action) => {
     state.socketConnection = action.payload
   },

  },

  extraReducers: (builder) => {
    builder
      .addCase(RegisterAuth.pending, (state,action) => {
        state.status = action.payload?.status; 
        state.error = null;
      })
      .addCase(RegisterAuth.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
        state.user = action.payload?.data;
      })
      .addCase(RegisterAuth.rejected, (state, action) => {
        state.status = "failed"; 
        state.error = action.error.message; 
      })
      .addCase(EmailAuth.pending, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
      })
      .addCase(EmailAuth.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
        state.emailInfo = action.payload?.data;
      })
      .addCase(EmailAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(PasswordAuth.pending, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
      })
      .addCase(PasswordAuth.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
        state.passwordInfo = action.payload?.data;
      })
      .addCase(PasswordAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(FetchUserDetails.pending, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
      })
      .addCase(FetchUserDetails.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.userDetails = action?.payload?.data;
        state.error = null;
      })
      .addCase(FetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(UpdateUserDetails.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(UpdateUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails = { ...state.userDetails, ...action.payload?.data }; 
        state.error = null;
      })
      .addCase(UpdateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(LogoutAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(LogoutAuth.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null; // Clear user data
        state.userDetails = null; // Clear user details
        state.onlineUser = []; // Clear online users
        state.socketConnection = false; // Reset socket connection
        state.error = null;
      })
      .addCase(LogoutAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ForgotEmailAuth (Step 1)
      .addCase(ForgotEmailAuth.pending, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
      })
      .addCase(ForgotEmailAuth.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
        state.forgotEmailInfo = action.payload?.data;
      })
      .addCase(ForgotEmailAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
// reset password 
      .addCase(ResetPasswordAuth.pending, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
      })
      .addCase(ResetPasswordAuth.fulfilled, (state, action) => {
        state.status = action.payload?.status;
        state.error = null;
        state.resetPasswordInfo = action.payload?.data;
      })
      .addCase(ResetPasswordAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const { onlineUserArray,SetsocketConnection } = AuthSlicer.actions;

export default AuthSlicer.reducer;
