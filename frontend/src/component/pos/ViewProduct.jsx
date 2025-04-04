
// import React, { useEffect, useState } from "react";
// import axios from 'axios';
// import { useCart } from './CartContext';
// import { toast } from 'react-toastify';
// import NullImage from '../../assets/image.png';
// import { API_URL } from '../../service/api'

// const ProductGrid = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [brands, setbrands] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { addItem } = useCart();
//   const [filterCategory, setFilterCategory] = useState('');
//   const [filterBrand, setFilterBrand] = useState('');
//   const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [isDropdownOpenBrand, setIsDropdownOpenBrand] = useState(false);
//   const [selectedBrand, setSelectedBrand] = useState('');

//   useEffect(() => {
//     fetchCategories(); // Fetch categories once when the component mounts
//     getALLProduct();
//     fetchBrands();
//   }, [filterCategory, filterBrand]); // Dependency on filterCategory

//   // Fetch all products with category filter if available
//   const getALLProduct = async () => {
//     setLoading(true);
//     try {
//       let url = `${API_URL}/api/product/product`;
//       const params = [];
//       if (filterCategory) {
//         params.push(`category_id=${filterCategory}`);
//       }
//       if (filterBrand) {
//         params.push(`brand_id=${filterBrand}`);
//       }
//       if (params.length > 0) {
//         url += `?${params.join('&')}`;
//       }
//       const response = await axios.get(url);
//       if (response.data && response.data.length > 0) {
//         setProducts(response.data);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       setError('Error fetching product data');
//     } finally {
//       setLoading(false);
//     }
//   };




//   // Fetch available categories
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/categories`);
//       setCategories(response.data.categories);
//     } catch (error) {
//       setError('Error fetching categories data');
//     }
//   };

//   const fetchBrands = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/brands`);
//       setbrands(response.data.brands);
//     } catch (error) {
//       setError('Error fetching brands data');
//     }
//   };

//   // Handle adding product to cart
//   const handleAddToCart = (product) => {
//     if (product.qty > 0) {
//       addItem(product);
//     } else {
//       toast.warning('ផលិតផលនេះអស់ស្តុកហើយ។', {
//         position: "top-right",
//         autoClose: 800,
//       });
//     }
//   };

//   const handleBrandChange = (brand) => {
//     if (brand.id === 'all') {
//       setSelectedBrand('ម៉ាក់យីហោទាំងអស់');
//       setFilterBrand('');  // Reset the brand filter
//     } else {
//       setSelectedBrand(brand.brand_names);
//       setFilterBrand(brand.id);
//     }
//     setIsDropdownOpenBrand(false);
//   };


//   // Handle category change from dropdown
//   const handleCategoryChange = (category) => {
//     if (category.id === 'all') {
//       // Handle "Select All"
//       setSelectedCategory('ប្រភេទទាំងអស់');
//       setFilterCategory('');
//     } else {
//       setSelectedCategory(category.cat_names);
//       setFilterCategory(category.id);  // Set category filter
//     }
//     setIsDropdownOpenCategory(false);
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gray-100">
//       <div className="flex w-full mb-2 space-x-4">
//         {/* Category Dropdown */}
//         <div className="relative w-[300px]">
//           <div
//             className="cursor-pointer input_text"
//             onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
//           >
//             {selectedCategory || 'ប្រភេទទាំងអស់'}
//           </div>

//           {isDropdownOpenCategory && (
//             <div className="absolute z-10 bg-white border rounded-md mt-2 w-[300px]">
//               {/* Select All Option */}
//               <div
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleCategoryChange({ id: 'all', cat_names: 'Select All' })}
//               >
//                 ប្រភេទទាំងអស់
//               </div>

//               {/* Category Options */}
//               {categories.map((category) => (
//                 <div
//                   key={category.id}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleCategoryChange(category)}
//                 >
//                   {category.cat_names}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="relative w-[300px]">
//           <div className="cursor-pointer input_text" onClick={() => setIsDropdownOpenBrand(!isDropdownOpenBrand)}>
//             {selectedBrand || 'ម៉ាក់យីហោទាំងអស់'}
//           </div>
//           {isDropdownOpenBrand && (
//             <div className="absolute z-10 bg-white border rounded-md mt-2 w-[300px]">
//               {/* Select All Option */}
//               <div
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleBrandChange({ id: 'all', brand_names: 'ម៉ាក់យីហោទាំងអស់' })}
//               >
//                 ម៉ាក់យីហោទាំងអស់
//               </div>

//               {/* Brand Options */}
//               {brands.map((brand) => (
//                 <div
//                   key={brand.id}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleBrandChange(brand)}
//                 >
//                   {brand.brand_names}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>

//       {error && <div className="text-red-500">{error}</div>}

//       {loading ? (
//         <div className="flex items-center justify-center">
//           <svg className="text-gray-300 animate-spin" width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
//           </svg>
//         </div>
//       ) : products.length === 0 ? (
//         <div>
//           <div className="py-8 text-center text-gray-500 border-t">រកមិនឃើញផលិតផលសម្រាប់ដែលបានជ្រើសរើសទេ។</div>
//           <div className="flex items-center justify-center">
//             <svg className="text-gray-300 animate-spin" width="24" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
//             </svg>
//           </div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto scrollbar-hidden h-[75vh] border-t-2">
//           <div className="grid grid-cols-3 gap-4 pt-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3">
//             {products && products.length > 0 && products.map((product, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleAddToCart(product)}
//                 className="p-2 text-center bg-white rounded-md cursor-pointer drop-shadow"
//               >
//                 {product.image ? (
//                   <div className="flex items-center justify-center h-20">
//                     <img
//                       src={`${API_URL}/image/${product.image}`}
//                       alt={product.pro_names}
//                       className="object-contain w-full h-full mb-2 rounded"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-20">
//                     <img
//                       src={NullImage}
//                       alt={product.pro_names}
//                       className="object-contain w-full h-full mb-2 rounded"
//                     />
//                   </div>
//                 )}
//                 <h2 className="text-lg font-semibold">{product.pro_names}</h2>
//                 <p className="text-gray-500">{product.exclude_tax} $</p>
//               </div>
//             ))}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductGrid;




////////////////////////////////







import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import NullImage from '../../assets/image.png';
import { API_URL } from '../../service/api'
import { FaChevronDown } from "react-icons/fa";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setbrands] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpenBrand, setIsDropdownOpenBrand] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    fetchCategories(); // Fetch categories once when the component mounts
    getALLProduct();
    fetchBrands();
  }, [filterCategory, filterBrand]); // Dependency on filterCategory

  // Fetch all products with category filter if available
  const getALLProduct = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/product/product`;
      const params = [];
      if (filterCategory) {
        params.push(`category_id=${filterCategory}`);
      }
      if (filterBrand) {
        params.push(`brand_id=${filterBrand}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setError('Error fetching product data');
    } finally {
      setLoading(false);
    }
  };




  // Fetch available categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      setError('Error fetching categories data');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/brands`);
      setbrands(response.data.brands);
    } catch (error) {
      setError('Error fetching brands data');
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addItem(product);
    // if (product.qty > 0) {
    //   addItem(product);
    // } else {
    //   toast.warning('ផលិតផលនេះអស់ស្តុកហើយ1។', {
    //     position: "top-right",
    //     autoClose: 800,
    //   });
    // }
  };
  const handleAddToCart1 = (product) => {
    if (product.qty > 0) {
      addItem(product);
    } else {
      toast.warning('ផលិតផលនេះអស់ស្តុកហើយ1។', {
        position: "top-right",
        autoClose: 800,
      });
    }
  };

  const handleBrandChange = (brand) => {
    if (brand.id === 'all') {
      setSelectedBrand('ម៉ាក់យីហោទាំងអស់');
      setFilterBrand('');  // Reset the brand filter
    } else {
      setSelectedBrand(brand.brand_names);
      setFilterBrand(brand.id);
    }
    setIsDropdownOpenBrand(false);
  };


  // Handle category change from dropdown
  const handleCategoryChange = (category) => {
    if (category.id === 'all') {
      // Handle "Select All"
      setSelectedCategory('ប្រភេទទាំងអស់');
      setFilterCategory('');
    } else {
      setSelectedCategory(category.cat_names);
      setFilterCategory(category.id);  // Set category filter
    }
    setIsDropdownOpenCategory(false);
  };

  return (
    <div className="min-h-screen p-4 mt-3 bg-gray-50">
      <div className="flex w-full p-3 mb-2 space-x-4 bg-white">
        {/* Category Dropdown */}
        <div className="relative w-[300px]">
          <div
            className="flex items-center justify-between text-center cursor-pointer input_text"
            onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
          >
            <span> {selectedCategory || 'ប្រភេទទាំងអស់'} </span> <FaChevronDown />
          </div>

          {isDropdownOpenCategory && (
            <div className="absolute z-10 bg-white border mt-1 w-[300px]">
              {/* Select All Option */}
              <div
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCategoryChange({ id: 'all', cat_names: 'Select All' })}
              >
                ប្រភេទទាំងអស់
              </div>

              {/* Category Options */}
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.cat_names}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative w-[300px]">
          <div  className="flex items-center justify-between text-center cursor-pointer input_text" onClick={() => setIsDropdownOpenBrand(!isDropdownOpenBrand)}>
            <span> {selectedBrand || 'ម៉ាក់យីហោទាំងអស់'}  </span> <FaChevronDown />
          </div>
          {isDropdownOpenBrand && (
            <div className="absolute z-10 bg-white border mt-1 w-[300px]">
              {/* Select All Option */}
              <div
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleBrandChange({ id: 'all', brand_names: 'ម៉ាក់យីហោទាំងអស់' })}
              >
                ម៉ាក់យីហោទាំងអស់
              </div>

              {/* Brand Options */}
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleBrandChange(brand)}
                >
                  {brand.brand_names}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {error && <div className="text-red-500">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="text-gray-300 animate-spin" width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      ) : products.length === 0 ? (
        <div>
          <div className="py-8 text-center text-gray-500 border-t">រកមិនឃើញផលិតផលសម្រាប់ដែលបានជ្រើសរើសទេ។</div>
          <div className="flex items-center justify-center">
            <svg className="text-gray-300 animate-spin" width="24" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hidden h-[75vh] bg-white">
          <div className="grid grid-cols-3 gap-4 p-2 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3">
            {products && products.length > 0 && products.map((product, index) => (
              <div
                key={index}
                onClick={() => handleAddToCart(product)}
                className="p-2 p-3 text-center bg-white border cursor-pointer"
              >
                {product.image ? (
                  <div className="flex items-center justify-center h-20">
                    <img
                      src={`${API_URL}/image/${product.image}`}
                      alt={product.pro_names}
                      className="object-contain w-full h-full mb-2 rounded"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <img
                      src={NullImage}
                      alt={product.pro_names}
                      className="object-contain w-full h-full mb-2 rounded"
                    />
                  </div>
                )}
                <h2 className="text-lg font-semibold">{product.pro_names}</h2>
                <p className="text-gray-500">${product.exclude_tax}</p>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
