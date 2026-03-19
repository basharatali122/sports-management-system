// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   fetchProducts,
//   fetchCategories,
// } from '../../store/productSlice';
// import { addToCart, fetchCart } from '../../store/cartSlice';
// import { toast } from 'sonner';
// import {
//   ShoppingCartIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';

// const Products = () => {
//   const dispatch = useDispatch();
//   const { products, categories, loading } = useSelector((state) => state.products);
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [sortBy, setSortBy] = useState('created_at');
//   const [showFilters, setShowFilters] = useState(false);
//   const [addingToCart, setAddingToCart] = useState({});

//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchCategories());
//     if (isAuthenticated) {
//       dispatch(fetchCart());
//     }
//   }, [dispatch, isAuthenticated]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     applyFilters();
//   };

//   const applyFilters = () => {
//     const filters = {};
//     if (searchTerm) filters.search = searchTerm;
//     if (selectedCategory) filters.category = selectedCategory;
//     if (priceRange.min) filters.minPrice = priceRange.min;
//     if (priceRange.max) filters.maxPrice = priceRange.max;
//     if (sortBy) filters.sort = sortBy;
    
//     dispatch(fetchProducts(filters));
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setPriceRange({ min: '', max: '' });
//     setSortBy('created_at');
//     dispatch(fetchProducts());
//   };

//   const handleAddToCart = async (product) => {
//     if (!isAuthenticated) {
//       toast.error('Please login to add items to cart');
//       return;
//     }

//     if (product.stock < 1) {
//       toast.error('Product out of stock');
//       return;
//     }

//     setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
//     try {
//       await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
//       await dispatch(fetchCart());
//       toast.success(`${product.name} added to cart!`);
//     } catch (error) {
//       toast.error(error || 'Failed to add to cart');
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [product._id]: false }));
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Sports Kits & Equipment</h1>
//         <p className="text-gray-600 mt-2">Browse our collection of high-quality sports gear</p>
//       </div>

//       {/* Mobile Filter Button */}
//       <div className="lg:hidden mb-4">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
//         >
//           <FunnelIcon className="h-5 w-5" />
//           <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
//         </button>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Filters Sidebar */}
//         <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Filters</h2>
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-indigo-600 hover:text-indigo-800"
//               >
//                 Clear All
//               </button>
//             </div>

//             {/* Search */}
//             <form onSubmit={handleSearch} className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
//               </div>
//             </form>

//             {/* Category Filter */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Price Range */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price Range
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="number"
//                   value={priceRange.min}
//                   onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//                   placeholder="Min"
//                   className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <input
//                   type="number"
//                   value={priceRange.max}
//                   onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//                   placeholder="Max"
//                   className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* Sort By */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Sort By
//               </label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="created_at">Newest</option>
//                 <option value="price">Price: Low to High</option>
//                 <option value="-price">Price: High to Low</option>
//                 <option value="name">Name</option>
//               </select>
//             </div>

//             {/* Apply Filters Button */}
//             <button
//               onClick={applyFilters}
//               className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="flex-1">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No products found</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
//                 >
//                   <Link to={`/products/${product._id}`}>
//                     <div className="h-48 bg-gray-200 overflow-hidden">
//                       {product.image ? (
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-400">
//                           No Image
//                         </div>
//                       )}
//                     </div>
//                   </Link>
                  
//                   <div className="p-4">
//                     <Link to={`/products/${product._id}`}>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600">
//                         {product.name}
//                       </h3>
//                     </Link>
                    
//                     <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-xl font-bold text-indigo-600">
//                         ₹{product.price.toFixed(2)}
//                       </span>
//                       <span className={`text-sm ${
//                         product.stock > 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//                       </span>
//                     </div>
                    
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
                    
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       disabled={product.stock < 1 || addingToCart[product._id]}
//                       className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                     >
//                       {addingToCart[product._id] ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           <span>Adding...</span>
//                         </>
//                       ) : (
//                         <>
//                           <ShoppingCartIcon className="h-5 w-5" />
//                           <span>Add to Cart</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchProducts,
  fetchCategories,
} from '../../store/productSlice';
import { addToCart, fetchCart } from '../../store/cartSlice';
import { toast } from 'sonner';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const Products = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    console.log('Fetching products...'); // Debug log
    dispatch(fetchProducts())
      .unwrap()
      .then((result) => {
        console.log('Products fetched successfully:', result);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        toast.error('Failed to load products');
      });
    
    dispatch(fetchCategories())
      .unwrap()
      .then((result) => {
        console.log('Categories fetched:', result);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
      
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // Log when products state changes
  useEffect(() => {
    console.log('Products in state:', products);
  }, [products]);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.category = selectedCategory;
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;
    if (sortBy) filters.sort = sortBy;
    
    console.log('Applying filters:', filters);
    dispatch(fetchProducts(filters));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('created_at');
    dispatch(fetchProducts());
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock < 1) {
      toast.error('Product out of stock');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      await dispatch(fetchCart());
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <ExclamationCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchProducts())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sports Kits & Equipment</h1>
        <p className="text-gray-600 mt-2">Browse our collection of high-quality sports gear</p>
        <p className="text-sm text-gray-500 mt-1">Found {products.length} products</p>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </form>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No products found</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{product.price?.toFixed(2) || '0.00'}
                      </span>
                      <span className={`text-sm ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock < 1 || addingToCart[product._id]}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {addingToCart[product._id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;