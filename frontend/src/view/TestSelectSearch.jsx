// // import React, { useEffect, useState } from 'react';
// // import Navbar from '../component/Navbar';
// // import { RiContactsBook3Fill } from "react-icons/ri";
// // import axios from 'axios';

// // const TestSelectSearch = () => {
// //   const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
// //   const [selectedCategory, setSelectedCategory] = useState('');

// //   const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState('');

// //   const [category_ID, setCategory_ID] = useState('');
// //   const [product_ID, setProduct_ID] = useState('');

// //   const [supplier, setsupplier] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchsupplier();
// //     fetchProducts();
// //   }, []);

// //   const fetchsupplier = async () => {
// //     setLoading(true);  // Start loading
// //     try {
// //       const response = await axios.get('http://localhost:6700/api/supplier');
// //       setsupplier(response.data.supplier);
// //       setError('');
// //     } catch (error) {
// //       setError('Error fetching supplier data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get('http://localhost:6700/api/product');
// //       setProducts(response.data.product);
// //       setError('');
// //     } catch (error) {
// //       setError('Error fetching products data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearchCategory = (event) => {
// //     setCategory_ID(event.target.value); // Update search query
// //   };

// //   const handleSearchProduct = (event) => {
// //     setProduct_ID(event.target.value); // Update search query
// //   };

// //   const handleOptionClickCategory = (option) => {
// //     setSelectedCategory(option.full_names || option.business_names);
// //     setIsDropdownOpenCategory(false);
// //   };

// //   const handleOptionClickProduct = (option) => {
// //     setSelectedProduct(option.pro_names);
// //     setIsDropdownOpenProduct(false);
// //   };

// //   // Filter options based on the search query
// //   const filteredOptionsCategory = supplier.filter(option =>
// //     option.full_names.toLowerCase().includes(category_ID.toLowerCase()) ||
// //     option.business_names.toLowerCase().includes(category_ID.toLowerCase())
// //   );

// //   const filteredOptionsProduct = products.filter(option =>
// //     option.pro_names.toLowerCase().includes(product_ID.toLowerCase())
// //   );

// //   return (
// //     <div>
// //       <Navbar />
// //       <div className='py-12 px-2 md:ml-64 bg-white dark:bg-gray-950'>
// //         <div className="p-4 bg-white dark:border-gray-700 mt-5">
// //           <div className='flex items-center gap-2 pb-5'>
// //             <RiContactsBook3Fill className='text-lg' />
// //             <p className='font-NotoSansKhmer font-bold text-lg'>Test</p>
// //           </div>
// //           <div className='flex gap-11'>
// //             <div className="col-span-1 space-y-2 w-[300px]">
// //               <label className="font-NotoSansKhmer font-bold">ប្រភេទពន្ធលើតម្លៃលក់: *</label>
// //               <div className="relative">
// //                 <div
// //                   className="input_text cursor-pointer"
// //                   onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
// //                 >
// //                   {selectedCategory || 'ជ្រើសរើស...'}
// //                 </div>

// //                 {isDropdownOpenCategory && (
// //                   <div className="absolute z-10 bg-white border rounded-md mt-2 w-[300px]">
// //                     <input
// //                       type="text"
// //                       value={category_ID}
// //                       onChange={handleSearchCategory}
// //                       className="input_text w-full p-2"
// //                       placeholder="ស្វែងរក..."
// //                     />

// //                     {/* Dropdown options */}
// //                     {filteredOptionsCategory.map((category) => (
// //                       <div
// //                         key={category.id} // Use the correct key
// //                         className="p-2 hover:bg-gray-100 cursor-pointer"
// //                         onClick={() => handleOptionClickCategory(category)}
// //                       >
// //                         {category.full_names}   {category.business_names}
// //                       </div>
// //                     ))}
// //                     {filteredOptionsCategory.length === 0 && (
// //                       <div className="p-2 text-red-500">No supplier found</div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="col-span-1 space-y-2 w-[300px]">
// //               <label className="font-NotoSansKhmer font-bold">ផលិតផល: *</label>
// //               <div className="relative">
// //                 <div
// //                   className="input_text cursor-pointer"
// //                   onClick={() => setIsDropdownOpenProduct(!isDropdownOpenProduct)}
// //                 >
// //                   {selectedProduct || 'ជ្រើសរើស...'}
// //                 </div>

// //                 {isDropdownOpenProduct && (
// //                   <div className="absolute z-10 bg-white border overflow-y-auto rounded-md mt-2 w-[300px]">
// //                     <input
// //                       type="text"
// //                       value={product_ID}
// //                       onChange={handleSearchProduct}
// //                       className="input_text w-full p-2"
// //                       placeholder="ស្វែងរក..."
// //                     />
// //                     <div className='overflow-y-auto rounded-md mt-2 h-[250px]'>
// //                       {/* Dropdown options */}
// //                       {filteredOptionsProduct.map((product) => (
// //                         <div
// //                           key={product.id} // Use the correct key
// //                           className="p-2 hover:bg-gray-100 cursor-pointer"
// //                           onClick={() => handleOptionClickProduct(product)}
// //                         >
// //                           {product.pro_names}
// //                         </div>
// //                       ))}
// //                       {filteredOptionsProduct.length === 0 && (
// //                         <div className="p-2 text-red-500">No products found</div>
// //                       )}
// //                     </div>
// //                     {loading && <p className="text-blue-500">Loading...</p>}
// //                     {error && <p className="text-red-500">{error}</p>}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TestSelectSearch;





// import React, { useEffect, useState } from 'react';
// import Navbar from '../component/Navbar';
// import { RiContactsBook3Fill } from "react-icons/ri";
// import { FaSearch } from "react-icons/fa"; // Import FaSearch
// import axios from 'axios';
// import { IoMdClose } from "react-icons/io";

// const TestSelectSearch = () => {
//   const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [quantities, setQuantities] = useState({});
//   const [discounts, setDiscounts] = useState({});

//   const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState('');

//   const [category_ID, setCategory_ID] = useState('');
//   const [product_ID, setProduct_ID] = useState('');

//   const [supplier, setsupplier] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]); // State for selected products
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchsupplier();
//     fetchProducts();
//   }, []);

//   const fetchsupplier = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:6700/api/supplier');
//       setsupplier(response.data.supplier);
//       setError('');
//     } catch (error) {
//       setError('Error fetching supplier data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:6700/api/product');
//       setProducts(response.data.product);
//       setError('');
//     } catch (error) {
//       setError('Error fetching products data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchCategory = (event) => {
//     setCategory_ID(event.target.value);
//   };



//   const handleOptionClickCategory = (option) => {
//     setSelectedCategory(option.full_names || option.business_names);
//     setIsDropdownOpenCategory(false);
//   };

//   const handleAddProduct = (product) => {
//     if (selectedProducts.find((p) => p.id === product.id)) {
//       alert("Product already exists!");
//     } else {
//       setSelectedProducts([...selectedProducts, product]); // Add selected product to the array
//       setIsDropdownOpenProduct(false); // Close the dropdown
//     }
//     setProduct_ID(""); // Clear the search input after adding
//   };

//   const handleQtyChange = (productId, value) => {
//     setQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [productId]: value >= 1 ? Number(value) : 1, // Ensure quantity is at least 1
//     }));
//   };



//   const handleRemoveProduct = (productId) => {
//     setSelectedProducts(
//       selectedProducts.filter((product) => product.id !== productId)
//     );
//   };

//   // Filter options based on the search query
//   const filteredOptionsCategory = supplier.filter(option =>
//     option.full_names.toLowerCase().includes(category_ID.toLowerCase()) ||
//     option.business_names.toLowerCase().includes(category_ID.toLowerCase())
//   );

//   const filteredOptionsProduct = products.filter(option =>
//     option.pro_names.toLowerCase().includes(product_ID.toLowerCase())
//   );

//   return (
//     <div>
//       <Navbar />
//       <div className='py-12 px-2 md:ml-64 bg-white dark:bg-gray-950'>
//         <div className="p-4 bg-white dark:border-gray-700 mt-5">
//           <div className='flex items-center gap-2 pb-5'>
//             <RiContactsBook3Fill className='text-lg' />
//             <p className='font-NotoSansKhmer font-bold text-lg'>Test</p>
//           </div>
//           <div className='flex gap-11'>
//             {/* Category Dropdown */}
//             <div className="col-span-1 space-y-2 w-[300px]">
//               <label className="font-NotoSansKhmer font-bold">ប្រភេទពន្ធលើតម្លៃលក់: *</label>
//               <div className="relative">
//                 <div
//                   className="input_text cursor-pointer"
//                   onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
//                 >
//                   {selectedCategory || 'ជ្រើសរើស...'}
//                 </div>

//                 {isDropdownOpenCategory && (
//                   <div className="absolute z-10 p-2 bg-white border rounded-md mt-2 w-[300px]">
//                     <input
//                       type="text"
//                       value={category_ID}
//                       onChange={handleSearchCategory}
//                       className="input_text w-full p-2"
//                       placeholder="ស្វែងរក..."
//                     />
//                     {/* Dropdown options */}
//                     {filteredOptionsCategory.map((category) => (
//                       <div
//                         key={category.id}
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleOptionClickCategory(category)}
//                       >
//                         {category.full_names} {category.business_names}
//                       </div>
//                     ))}
//                     {filteredOptionsCategory.length === 0 && (
//                       <div className="p-2 text-red-500">No supplier found</div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Product Search Input */}
//             <div className="relative items-center gap-3 mx-auto my-2">
//               <div className="relative">
//                 <div className="flex justify-center">
//                   <input
//                     type="text"
//                     className="w-full input_text"
//                     placeholder="ស្វែងរកកាតទូរស័ព្ទ"
//                     value={product_ID}
//                     onChange={(e) => {
//                       setProduct_ID(e.target.value);
//                       setIsDropdownOpenProduct(true)
//                     }}
//                     onFocus={() => setIsDropdownOpenProduct(false)}
//                   />
//                   <div className="absolute right-[2%] top-3.5">
//                     <FaSearch className="text-gray-400" />
//                   </div>
//                 </div>
//               </div>

//               {/* Dropdown for Products */}
//               {isDropdownOpenProduct && (
//                 <div className="flex justify-center">
//                   <ul className="absolute z-[2] w-full mt-1 overflow-y-auto bg-white border border-gray-300 shadow-md max-h-48">
//                     {filteredOptionsProduct.length > 0 ? (
//                       filteredOptionsProduct.map((product) => (
//                         <li
//                           key={product.id}
//                           className="p-2 text-gray-700 cursor-pointer hover:bg-gray-200 hover:text-black"
//                           onClick={() => handleAddProduct(product)} // Add product on click
//                         >
//                           {product.pro_names}
//                         </li>
//                       ))
//                     ) : (
//                       <li className="p-2 text-gray-500 font-NotoSansKhmer">
//                         មិនមានកាត ឈ្មោះនេះ​{" "}
//                         <span className="font-bold">{product_ID}</span>{" "}
//                         ទេ!
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>


//           </div>
//           {/* Table for Selected Products */}
//           <table className="mt-4 border-collapse w-[1050px]">
//             <thead className="p-2 text-white bg-blue-600/90">
//               <tr>
//                 <th className="p-2 border w-[7%]">លេខរៀង</th>
//                 <th className="p-2 border w-[20%]">ឈ្មោះផលិតផល</th>
//                 <th className="p-2 border w-[10%]">តម្លៃដើម(ឯកតា)</th>
//                 <th className="p-2 border w-[15%]">បរិមាណទិញចូល</th>
//                 <th className="p-2 border w-[15%]">បញ្ចុះតម្លៃ</th>
//                 <th className="p-2 border w-[15%]">ពន្ធសរុប</th>
//                 <th className="p-2 border w-[15%]">សរុប</th>
//                 <th className="p-2 border w-[5]">
//                   <p className="text-center">ស្ថានភាព</p>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedProducts.length > 0 ? (
//                 selectedProducts.map((product, index) => {
//                   const qty = quantities[product.id] || 1; // Default to 1 if no quantity is set
//                   const total = qty * product.cost_price; // Calculate total
//                   return (
//                     <tr key={product.id}>
//                       <td className="p-2 w-[7%]">{index + 1}</td>
//                       <td className="p-2 w-[10%]">{product.pro_names}</td>
//                       <td className="w-[10%]">
//                         <input
//                           min={1}
//                           type="number"
//                           step={1}
//                           value={qty}
//                           onChange={(e) => handleQtyChange(product.id, e.target.value)}
//                           placeholder="0.0"
//                           className="input_text"
//                         />
//                       </td>
//                       <td className="w-[15%]">
//                         <input
//                           min={0}
//                           disabled
//                           type="number"
//                           placeholder="0.0"
//                           value={product.cost_price}
//                           className="bg-gray-100 input_text"
//                         />
//                       </td>
//                       <td className="w-[10%]">
//                         <select className="input_text">
//                           <option value="">ជ្រើសរើស</option>
//                           <option value="សន្លឹក">សន្លឹក</option>
//                           <option value="បន្ទាស">បន្ទាស</option>
//                         </select>
//                       </td>
//                       <td className="w-[15%]">
//                         <input
//                           min={0}
//                           type="number"
//                           value={total.toFixed(2)} // Display total with two decimal places
//                           placeholder="0.0"
//                           readOnly
//                           className="bg-gray-100 input_text"
//                         />
//                       </td>
//                       <td className="p-2 w-[5%]">
//                         <div className="flex justify-center">
//                           <button
//                             className="p-2 text-white bg-red-500 hover:text-white hover:bg-red-400"
//                             onClick={() => handleRemoveProduct(product.id)}
//                           >
//                             <IoMdClose />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="p-2 text-center text-gray-500"
//                   >
//                     សូមជ្រើសរើសកាតទូរស័ព្ទ
//                   </td>
//                 </tr>
//               )}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestSelectSearch;



import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa"; // Import FaSearch
import axios from 'axios';
import { IoMdClose } from "react-icons/io";

const TestSelectSearch = () => {
  const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState({});
  const [discounts, setDiscounts] = useState({});
  const [taxes, setTaxes] = useState({});

  const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  const [category_ID, setCategory_ID] = useState('');
  const [product_ID, setProduct_ID] = useState('');

  const [supplier, setsupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // State for selected products
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchsupplier();
    fetchProducts();
  }, []);

  const fetchsupplier = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:6700/api/supplier');
      setsupplier(response.data.supplier);
      setError('');
    } catch (error) {
      setError('Error fetching supplier data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:6700/api/product');
      setProducts(response.data.product);
      setError('');
    } catch (error) {
      setError('Error fetching products data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCategory = (event) => {
    setCategory_ID(event.target.value);
  };

  const handleOptionClickCategory = (option) => {
    setSelectedCategory(option.full_names || option.business_names);
    setIsDropdownOpenCategory(false);
  };

  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      alert("Product already exists!");
    } else {
      setSelectedProducts([...selectedProducts, product]); // Add selected product to the array
      setIsDropdownOpenProduct(false); // Close the dropdown
    }
    setProduct_ID(""); // Clear the search input after adding
  };

  const handleQtyChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value >= 1 ? Number(value) : 1, // Ensure quantity is at least 1
    }));
  };

  const handleDiscountChange = (productId, value) => {
    setDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [productId]: value >= 0 ? Number(value) : 0, // Ensure discount is not negative
    }));
  };
  const handleTaxChange = (productId, value) => {
    setTaxes((prevTaxes) => ({
      ...prevTaxes,
      [productId]: value >= 0 ? Number(value) : 0, // Ensure tax is not negative
    }));
  };


  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  // Filter options based on the search query
  const filteredOptionsCategory = supplier.filter(option =>
    option.full_names.toLowerCase().includes(category_ID.toLowerCase()) ||
    option.business_names.toLowerCase().includes(category_ID.toLowerCase())
  );

  const filteredOptionsProduct = products.filter(option =>
    option.pro_names.toLowerCase().includes(product_ID.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className='py-12 px-2 md:ml-64 bg-white dark:bg-gray-950'>
        <div className="p-4 bg-white dark:border-gray-700 mt-5">
          <div className='flex items-center gap-2 pb-5'>
            <RiContactsBook3Fill className='text-lg' />
            <p className='font-NotoSansKhmer font-bold text-lg'>Test</p>
          </div>
          <div className='flex gap-11'>
            {/* Category Dropdown */}
            <div className="col-span-1 space-y-2 w-[300px]">
              <label className="font-NotoSansKhmer font-bold">ប្រភេទពន្ធលើតម្លៃលក់: *</label>
              <div className="relative">
                <div
                  className="input_text cursor-pointer"
                  onClick={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}
                >
                  {selectedCategory || 'ជ្រើសរើស...'}
                </div>

                {isDropdownOpenCategory && (
                  <div className="absolute z-10 p-2 bg-white border rounded-md mt-2 w-[300px]">
                    <input
                      type="text"
                      value={category_ID}
                      onChange={handleSearchCategory}
                      className="input_text w-full p-2"
                      placeholder="ស្វែងរក..."
                    />
                    {/* Dropdown options */}
                    {filteredOptionsCategory.map((category) => (
                      <div
                        key={category.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleOptionClickCategory(category)}
                      >
                        {category.full_names} {category.business_names}
                      </div>
                    ))}
                    {filteredOptionsCategory.length === 0 && (
                      <div className="p-2 text-red-500">No supplier found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Search Input */}
            <div className="relative items-center gap-3 mx-auto my-2">
              <div className="relative">
                <div className="flex justify-center">
                  <input
                    type="text"
                    className="w-full input_text"
                    placeholder="ស្វែងរកកាតទូរស័ព្ទ"
                    value={product_ID}
                    onChange={(e) => {
                      setProduct_ID(e.target.value);
                      setIsDropdownOpenProduct(true);
                    }}
                    onFocus={() => setIsDropdownOpenProduct(false)}
                  />
                  <div className="absolute right-[2%] top-3.5">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Dropdown for Products */}
              {isDropdownOpenProduct && (
                <div className="flex justify-center">
                  <ul className="absolute z-[2] w-full mt-1 overflow-y-auto bg-white border border-gray-300 shadow-md max-h-48">
                    {filteredOptionsProduct.length > 0 ? (
                      filteredOptionsProduct.map((product) => (
                        <li
                          key={product.id}
                          className="p-2 text-gray-700 cursor-pointer hover:bg-gray-200 hover:text-black"
                          onClick={() => handleAddProduct(product)} // Add product on click
                        >
                          {product.pro_names}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500 font-NotoSansKhmer">
                        មិនមានកាត ឈ្មោះនេះ​{" "}
                        <span className="font-bold">{product_ID}</span>{" "}
                        ទេ!
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Table for Selected Products */}
          <table className="mt-4 border-collapse w-[1050px]">
            <thead className="p-2 text-white bg-blue-600/90">
              <tr>
                <th className="p-2 border w-[7%]">លេខរៀង</th>
                <th className="p-2 border w-[20%]">ឈ្មោះផលិតផល</th>
                <th className="p-2 border w-[10%]">តម្លៃដើម(ឯកតា)</th>
                <th className="p-2 border w-[15%]">បរិមាណទិញចូល</th>
                <th className="p-2 border w-[15%]">បញ្ចុះតម្លៃ</th>
                <th className="p-2 border w-[15%]">ពន្ធសរុប</th>
                <th className="p-2 border w-[15%]">សរុប</th>
                <th className="p-2 border w-[5%]">
                  <p className="text-center">ស្ថានភាព</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.length > 0 ? (
                selectedProducts.map((product, index) => {
                  const qty = quantities[product.id] || 1; // Default to 1 if no quantity is set
                  const discount = discounts[product.id] || 0; // Default discount to 0
                  const tax = taxes[product.id] || 0; // Get tax for the product, default to 0
                  const totalPrice = qty * product.cost_price; // Calculate total price
                  const totalTax = (totalPrice - discount) * 0.1; // Assuming a 10% tax rate
                  const grandTotal = totalPrice - discount + tax; // Calculate grand total

                  return (
                    <tr key={product.id}>
                      <td className="p-2 w-[7%]">{index + 1}</td>
                      <td className="p-2 w-[20%]">{product.pro_names}</td>
                      <td className="w-[10%]">
                        <input
                          min={1}
                          type="number"
                          step={1}
                          value={qty}
                          onChange={(e) => handleQtyChange(product.id, e.target.value)}
                          placeholder="0.0"
                          className="input_text"
                        />
                      </td>
                      <td className="w-[15%]">
                        <input
                          min={0}
                          disabled
                          type="number"
                          placeholder="0.0"
                          value={product.cost_price}
                          className="bg-gray-100 input_text"
                        />
                      </td>
                      <td className="w-[15%]">
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                          placeholder="0"
                          className="input_text"
                        />
                      </td>
                      <td className="w-[15%]">
                        <input
                          min={0}
                          type="number"
                          value={tax}
                          onChange={(e) => handleTaxChange(product.id, e.target.value)} // Use the new handler
                          placeholder="0"
                          className="input_text"
                        />
                      </td>
                      <td className="w-[15%]">
                        <input
                          min={0}
                          type="number"
                          value={grandTotal.toFixed(2)} // Assuming you want to keep this tax calculation
                          placeholder="0.0"
                          readOnly
                          className="bg-gray-100 input_text"
                        />
                      </td>
                      <td className="p-2 w-[5%]">
                        <div className="flex justify-center">
                          <button
                            className="p-2 text-white bg-red-500 hover:text-white hover:bg-red-400"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <IoMdClose />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-2 text-center text-gray-500"
                  >
                    សូមជ្រើសរើសកាតទូរស័ព្ទ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestSelectSearch;
