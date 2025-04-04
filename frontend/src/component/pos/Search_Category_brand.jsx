// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import {API_URL} from '../../service/api'

// const Search_Category_brand = () => {
//   const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState('');

//   const [category_ID, setCategory_ID] = useState('');
//   const [product_ID, setProduct_ID] = useState('');

//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, []);

//   const fetchCategories = async () => {
//     setLoading(true);  // Start loading
//     try {
//       const response = await axios.get(`${API_URL}/categories`);
//       setCategories(response.data.categories);
//       setError('');
//     } catch (error) {
//       setError('Error fetching categories data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/api/brands`);
//       setProducts(response.data.brands);
//       setError('');
//     } catch (error) {
//       setError('Error fetching products data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchCategory = (event) => {
//     setCategory_ID(event.target.value); // Update search query
//   };

//   const handleSearchProduct = (event) => {
//     setProduct_ID(event.target.value); // Update search query
//   };

//   const handleOptionClickCategory = (option) => {
//     setSelectedCategory(option.cat_names);
//     setIsDropdownOpenCategory(false);
//   };

//   const handleOptionClickProduct = (option) => {
//     setSelectedProduct(option.brand_names);
//     setIsDropdownOpenProduct(false);
//   };

//   // Filter options based on the search query
//   const filteredOptionsCategory = categories.filter(option =>
//     option.cat_names.toLowerCase().includes(category_ID.toLowerCase())
//   );

//   const filteredOptionsProduct = products.filter(option =>
//     option.brand_names.toLowerCase().includes(product_ID.toLowerCase())
//   );

//   return (

//     <div className='flex gap-12'>
//       <div className="col-span-1 space-y-2 w-[300px]">
//         {/* <label className="font-NotoSansKhmer font-bold">ប្រភេទ</label> */}
//         <div className="relative">
//           <div
//             className="input_text cursor-pointer"
//             onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
//           >
//             {selectedCategory || 'ប្រភេទទាំងអស់'}
//           </div>

//           {isDropdownOpenCategory && (
//             <div className="absolute z-10 bg-white border rounded-md mt-2 w-[300px]">
//               <input
//                 type="text"
//                 value={category_ID}
//                 onChange={handleSearchCategory}
//                 className="input_text w-full p-2"
//                 placeholder="ស្វែងរក..."
//               />
//               <Link to={`/index/pos`} onClick={() => handleOptionClickCategory(category)}>
//                 <div className='w-[295px] p-2 mt-2 bg-gray-200'>
//                 ប្រភេទទាំងអស់
//                 </div>
//               </Link>
//               {/* Dropdown options */}
//               {filteredOptionsCategory.map((category) => (
//                 <Link to={`/index/pos/id/${category.id}`} >
//                   <div
//                     key={category.id} // Use the correct key
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handleOptionClickCategory(category)}
//                   >
//                     {category.cat_names}
//                   </div>
//                 </Link>
//               ))}
//               {filteredOptionsCategory.length === 0 && (
//                 <div className="p-2 text-red-500">No categories found</div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="col-span-1 space-y-2 w-[300px]">
//         {/* <label className="font-NotoSansKhmer font-bold">ម៉ាក់យីហោ</label> */}
//         <div className="relative">
//           <div
//             className="input_text cursor-pointer"
//             onClick={() => setIsDropdownOpenProduct(!isDropdownOpenProduct)}
//           >
//             {selectedProduct || 'ម៉ាក់យីហោទាំងអស់'}
//           </div>

//           {isDropdownOpenProduct && (
//             <div className="absolute z-10 bg-white border overflow-y-auto rounded-md mt-2 w-[300px]">
//               <input
//                 type="text"
//                 value={product_ID}
//                 onChange={handleSearchProduct}
//                 className="input_text w-full p-2"
//                 placeholder="ស្វែងរក..."
//               />
//               <div className='overflow-y-auto h-[250px]'>
//                 <Link to={`/index/pos`} onClick={() => handleOptionClickProduct(brand)}>
//                   <div className='w-[290px] p-2 mt-2 bg-gray-200'>
//                     ម៉ាក់យីហោទាំងអស់
//                   </div>
//                 </Link>
//                 {/* Dropdown options */}
//                 {filteredOptionsProduct.map((brand) => (
//                   <Link to={`/index/pos/id/${brand.id}`} >
//                     <div
//                       key={brand.id} // Use the correct key
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => handleOptionClickProduct(brand)}
//                     >
//                       {brand.brand_names}
//                     </div>
//                   </Link>
//                 ))}
//                 {filteredOptionsProduct.length === 0 && (
//                   <div className="p-2 text-red-500">No products found</div>
//                 )}
//               </div>
//               {loading && <p className="text-blue-500">Loading...</p>}
//               {error && <p className="text-red-500">{error}</p>}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Search_Category_brand;


import React from 'react'

function Search_Category_brand() {
  return (
    <div>Search_Category_brand</div>
  )
}

export default Search_Category_brand