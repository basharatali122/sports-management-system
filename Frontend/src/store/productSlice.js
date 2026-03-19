// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// // Helper function to get token
// const getToken = () => {
//   return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
// };

// // Async thunks
// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async ({ category, search, minPrice, maxPrice, sort } = {}, { rejectWithValue }) => {
//     try {
//       let url = `${API_URL}/products`;
//       const params = new URLSearchParams();
      
//       if (category) params.append('category', category);
//       if (search) params.append('search', search);
//       if (minPrice) params.append('min_price', minPrice);
//       if (maxPrice) params.append('max_price', maxPrice);
//       if (sort) params.append('sort', sort);
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }
      
//       const response = await axios.get(url);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
//     }
//   }
// );

// export const fetchProductById = createAsyncThunk(
//   'products/fetchProductById',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/products/${productId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
//     }
//   }
// );

// export const createProduct = createAsyncThunk(
//   'products/createProduct',
//   async (productData, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       const response = await axios.post(
//         `${API_URL}/products`,
//         productData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to create product');
//     }
//   }
// );

// export const updateProduct = createAsyncThunk(
//   'products/updateProduct',
//   async ({ productId, productData }, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       const response = await axios.put(
//         `${API_URL}/products/${productId}`,
//         productData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to update product');
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   'products/deleteProduct',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       await axios.delete(
//         `${API_URL}/products/${productId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return productId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
//     }
//   }
// );

// export const fetchCategories = createAsyncThunk(
//   'products/fetchCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/products/categories`);
//       return response.data.data.categories;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
//     }
//   }
// );

// const productSlice = createSlice({
//   name: 'products',
//   initialState: {
//     products: [],
//     currentProduct: null,
//     categories: [],
//     total: 0,
//     loading: false,
//     error: null
//   },
//   reducers: {
//     clearCurrentProduct: (state) => {
//       state.currentProduct = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Products
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload.products;
//         state.total = action.payload.total;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Product By Id
//       .addCase(fetchProductById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProductById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProduct = action.payload;
//       })
//       .addCase(fetchProductById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Create Product
//       .addCase(createProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products.unshift(action.payload);
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Update Product
//       .addCase(updateProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.products.findIndex(p => p._id === action.payload._id);
//         if (index !== -1) {
//           state.products[index] = action.payload;
//         }
//         if (state.currentProduct?._id === action.payload._id) {
//           state.currentProduct = action.payload;
//         }
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Delete Product
//       .addCase(deleteProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = state.products.filter(p => p._id !== action.payload);
//         if (state.currentProduct?._id === action.payload) {
//           state.currentProduct = null;
//         }
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Categories
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.categories = action.payload;
//       });
//   }
// });

// export const { clearCurrentProduct, clearError } = productSlice.actions;
// export default productSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get token
const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, minPrice, maxPrice, sort } = {}, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/products`;
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (sort) params.append('sort', sort);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching products from:', url); // Debug log
      
      const response = await axios.get(url);
      console.log('Products API response:', response.data); // Debug log
      
      // Make sure we're returning the correct data structure
      return response.data.data; // This should contain { products, total, limit, skip }
    } catch (error) {
      console.error('Fetch products error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/products`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/products/${productId}`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(
        `${API_URL}/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      console.log('Categories API response:', response.data); // Debug log
      return response.data.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    categories: [],
    total: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Updating state with products:', action.payload); // Debug log
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Fetch products rejected:', action.payload); // Debug log
      })
      
      // Fetch Product By Id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;