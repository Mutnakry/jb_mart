
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaClipboardList, FaFileCsv, FaFileExcel, FaPencilAlt, FaSearch } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../Navbar'

function CreateProduct() {

  const [ProNames, setProNames] = useState('');
  const [category_ID, setCategory_ID] = useState(null);
  const [brand_ID, setBrand_ID] = useState(null);
  const [unit_ID, setUnit_ID] = useState('');
  const [note_QTY, setNote_Qty] = useState(1);
  const [product_type, setProduct_type] = useState('មួយ');
  const [include_Tax, setInclude_Tax] = useState(null);
  const [type_Tax, setType_Tax] = useState('ផ្ដាច់មុខ');
  const [description, setDescription] = useState(null);
  const [expiry, setExpiry] = useState(null);

  const [existingImage, setExistingImage] = useState(null);
  const [file, setFile] = useState(null);
  const [cost_Price, setCost_Price] = useState('');
  const [exclude_Tax, setExclude_Tax] = useState('');
  const [profit, setProfit] = useState('');
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [enabled, setEnabled] = useState(false);

  const [userLoginNames, setUserLoginNames] = useState('');
  const [categorys, setCategorys] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [Units, setUnits] = useState([]);


  //// paginate and search data
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);



  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_names') || '');
    getAllProduct();
    getALLCategorys();
    getALLBrands();
    getALLUnits();
  }, []);

  //// get all category
  const getALLCategorys = async () => {
    try {
      const response = await axios.get('http://localhost:6700/categories');
      setCategorys(response.data.categories);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  //// get all brands
  const getALLBrands = async () => {
    try {
      const response = await axios.get('http://localhost:6700/api/brands');
      setBrands(response.data.brands);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  //// get all unit
  const getALLUnits = async () => {
    try {
      const response = await axios.get('http://localhost:6700/api/unit');
      setUnits(response.data.unit);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };



  const handleToggle = () => {
    setEnabled((prevEnabled) => !prevEnabled); // Toggle the enabled state
  };

  const handleChangeProductType = (e) => {
    setProduct_type(e.target.value);
    setAmount("");
    setCost_Price("");
    setExclude_Tax("");
    setInclude_Tax("");
    setSelectedProducts([]); 
  };
  

const [amount,setAmount] = useState(0)
  const calculateProfit = () => {
    const profit1 =exclude_Tax - (cost_Price + include_Tax) ; 
    const amount1 = (cost_Price + include_Tax) ;
    setAmount(amount1)
    setProfit(profit1);
  };

  useEffect(() => {
    calculateProfit();
  }, [cost_Price, include_Tax, exclude_Tax]); 


  const [image, setImage] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (file) {
      if (validImageTypes.includes(file.type)) {
        const imageURL = URL.createObjectURL(file);
        setImage(imageURL);
        setError(null); // Clear any previous error
      } else {
        // setError("Please upload an image file (jpeg, jpg, png, or gif).");
        toast.error('សូមបញ្ចូលរូបភាព image.(jpeg,jpg,png,gif)', { autoClose: 2000 });

        setImage(null);
      }
    }
  };

  const [product_ID, setProduct_ID] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);

  /// get all category
  const getAllProduct = async () => {
    try {
      const response = await axios.get('http://localhost:6700/api/product');
      setProducts(response.data.product);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      toast.error(`ផលិតផល ${product.pro_names} មានរូចហើយ!`, {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setProduct_ID('');
    setIsDropdownOpenProduct(false);
  };

  const handleProductSearchChange = (e) => {
    setProduct_ID(e.target.value);
    setIsDropdownOpenProduct(e.target.value.length > 0);
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, quantity, total: product.price * quantity };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  const filteredOptionsProduct = products.filter(option =>
    option.pro_names.toLowerCase().includes(product_ID.toLowerCase())
  );

  // Calculate grand total for all selected products
  const grandTotal = selectedProducts.reduce((sum, product) => sum + (product.exclude_tax * product.quantity), 0);


  return (
    <div>
      <Navbar />
      <div className='py-12 px-6 md:ml-64 bg-gray-200 dark:bg-gray-950'>
        <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
          <div className='flex items-center gap-2 pb-5'>
            <p className='font-NotoSansKhmer font-bold text-3xl'>បន្ថែមការទិញ </p>

          </div>

          <form class="">
            <div className="">
              <div className='grid gap-4 mb-4 md:grid-cols-3 grid-cols-2'>
                <div class="col-span-1 space-y-2">
                  <label className="font-NotoSansKhmer font-bold">ឈ្មោះផលិតផល: *</label>
                  <input
                    type="text"
                    value={ProNames}
                    onChange={e => setProNames(e.target.value)}
                    id="price"
                    class="input_text "
                    placeholder="ឈ្មោះទំនិញ" required
                  />
                </div>
                <div class="col-span-1 space-y-2">
                  <label className="font-NotoSansKhmer font-bold">ប្រភេទបាកូដ:*</label>
                  <select
                    name=""
                    className='input_text'
                    id=""
                  >
                    <option value="">Code-128</option>
                    <option value="">Code-39</option>
                    <option value="">EAN-13</option>
                    <option value="">EAN-8</option>
                    <option value="">UPCA-A</option>

                  </select>
                </div>
              </div>
              <div className='border-t-2 border-yellow-600 shadow p-4 mb-4 rounded-lg'>
                <div class="grid gap-4 mb-4 md:grid-cols-3 grid-cols-2">
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ឯកតា:* </label>
                    <select
                      className='input_text'
                      id="unit_ID"
                      value={unit_ID}
                      required
                      onChange={e => setUnit_ID(e.target.value)}
                    >
                      <option value="">ជ្រើសរើស</option>
                      {Units?.map((items) => (
                        <option key={items.id} value={items.id}>
                          {items.names}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ម៉ាកយីហោ:</label>
                    <select
                      className='input_text'
                      id="brand_ID"
                      value={brand_ID}

                      onChange={e => setBrand_ID(e.target.value)}
                    >
                      <option value="">ជ្រើសរើសម៉ាកយីហោ</option>
                      {Brands?.map((items) => (
                        <option key={items.id} value={items.id}>
                          {items.brand_names}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ប្រភេទទំនេញ:</label>
                    <select
                      className='input_text'
                      value={category_ID}
                      onChange={e => setCategory_ID(e.target.value)}
                    >
                      <option value=''>ជ្រើសរើសប្រភេទទំនេញ</option>
                      {categorys?.map((items) => (
                        <option key={items.id} value={items.id}>
                          {items.cat_names}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div class="col-span-1 space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ជូនដំណឹងពីបរិមាណៈ</label>
                    <input
                      type="number"
                      value={note_QTY}
                      min={0}
                      onChange={e => setNote_Qty(e.target.value)}
                      id="price"
                      class="input_text "
                      placeholder="ជូនដំណឹងពីបរិមាណ"
                    />
                  </div>
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ថ្ងៃផុតកំណត់</label>
                    <input
                      type="date"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      id="price"
                      min={today}
                      class="input_text "
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="col-span-1 space-y-2 text-center">
                      <label className="font-NotoSansKhmer border-dashed rounded-lg cursor-pointer bg-gray-50 font-bold">
                        រូបភាពផលិតផល
                      </label>

                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
                      >
                        {image ? (
                          <img src={image} alt="Uploaded Preview" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-gray-400">រូបភាព</p>
                          </div>
                        )}
                        <input
                          id="dropzone-file"
                          type="file"
                          //  accept=".jpeg, .jpg, .png, .gif"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5 col-span-2">
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!enabled} // Inverse the checked value
                        onChange={handleToggle} // Call the new toggle handler
                        value=""
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">គ្រប់គ្រងស្តុក</span>
                    </label>

                    {!enabled && (
                      <div className="space-y-2">
                        <label htmlFor="">ចំនួនបរិមាណស្តុក: *</label>
                        <input className="input_text" type="number" placeholder="0" />
                      </div>
                    )}
                  </div>

                  <div class="col-span-3">
                    <label className="font-NotoSansKhmer font-bold">ការណិពណ័នា</label>
                    <textarea id="description"
                      rows="4"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      class="input_text"
                      placeholder="ការណិពណ័នា">
                    </textarea>
                  </div>
                </div>
              </div>

              <div className='border-t-2 border-blue-600 shadow p-4 mb-4 rounded-lg'>
                <div className='grid gap-4 mb-4 md:grid-cols-3 grid-cols-2'>
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ប្រភេទផលិតផល: *</label>
                    <select
                      className='input_text'
                      value={product_type}
                      onChange={handleChangeProductType}
                    >
                      <option value="មួយ">មួយ</option>
                      <option value="កញ្ចប់">កញ្ចប់</option>
                    </select>
                  </div>
                  <div class="col-span-1  space-y-2">
                    <label className="font-NotoSansKhmer font-bold">ប្រភេទពន្ធលើតម្លៃលក់: *</label>
                    <select
                      className='input_text'
                      value={type_Tax}
                      onChange={e => setType_Tax(e.target.value)}
                    >
                      <option value="ផ្ដាច់មុខ">ផ្ដាច់មុខ</option>
                      <option value="រួមបញ្ចូលគ្នា">រួមបញ្ចូលគ្នា</option>

                    </select>
                  </div>
                </div>

                {product_type === "កញ្ចប់" ? (
                  <div>
                    <div>
                      <div className="md:w-[70%] w-[100%] mx-auto mt-12">
                        <div className="relative items-center gap-3 mx-auto my-2">
                          <div className="relative">
                            <div className="flex justify-center">
                              <input
                                type="text"
                                className="w-full input_text"
                                placeholder="ស្វែងរកផលិតផល"
                                value={product_ID}
                                onChange={handleProductSearchChange}
                              />
                              <div className="absolute right-[4%] top-3.5">
                                <FaSearch className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                          {isDropdownOpenProduct && (
                            <div className="flex justify-center">
                              <ul className="absolute z-[2] w-full mt-1 overflow-y-auto bg-white border border-gray-300 shadow-md max-h-48">
                                {filteredOptionsProduct.length > 0 ? (
                                  filteredOptionsProduct.map((product) => (
                                    <li
                                      key={product.id}
                                      className="p-2 text-gray-700 cursor-pointer hover:bg-gray-200 hover:text-black"
                                      onClick={() => handleAddProduct(product)}
                                    >
                                      {product.pro_names}
                                    </li>
                                  ))
                                ) : (
                                  <li className="p-2 text-gray-500 font-NotoSansKhmer">
                                    មិនមានកាត ឈ្មោះនេះ​ <span className="font-bold">{product_ID}</span> ទេ!
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Display selected products */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">
                        កំណត់ប្រភេទទំនិញ
                      </h3>
                      <table className="w-full mt-4 border-collapse">
                        <thead className="p-2 text-white bg-blue-600/90">
                          <tr>
                            <th className="p-2 border w-[7%]">លេខរៀង</th>
                            <th className="p-2 border w-[20%]">ឈ្មោះផលិតផល</th>
                            <th className="p-2 border w-[10%]">តម្លៃដើម(ឯកតា)</th>
                            <th className="p-2 border w-[15%]">បរិមាណ</th>

                            <th className="p-2 border w-[15%]">សរុប</th>
                            <th className="p-2 border w-[5%]">
                              <p className="text-center">ស្ថានភាព</p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.map((product, index) => {
                            const total = product.exclude_tax * product.quantity;
                            return (
                              <tr key={product.id}>
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">
                                  {product.pro_names}
                                  <p className="text-xs text-gray-500">
                                    មានស្តុកនៅសល់ {product.qty} {product.unit}
                                    <br />
                                    តម្លៃលក់ {product.cost_Price}
                                  </p>
                                </td>
                                <td className="p-2 border">${product.exclude_tax}</td>
                                <td className="p-2 border">
                                  <input
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(product.id, (e.target.value))}
                                    className="w-full input_text"
                                  />
                                </td>
                                <td className="p-2 border">${total.toFixed(2)}</td>
                                <td className="p-2 border text-center">
                                  <button
                                    onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))}
                                    className="text-red-500"
                                  >
                                    X
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mt-3">
                      {/* <h3 className="text-lg font-semibold">
                    សរុបចំនួនទូទាត់ប្តូរទំនិញ
                  </h3> */}
                      <hr className="my-2" />
                      <div className="grid gap-3 grid-1-cols-">
                        <div className="space-y-2">
                          <label htmlFor="">ចំនួនការទូទាត់សរុប($)</label>
                          <input
                            type="number"
                            placeholder="0.0"
                            value={grandTotal.toFixed(2)}
                            min={0}
                            readOnly
                            className="bg-gray-100 input_text"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="">ប្រាក់លក់ដើម($)</label>
                          <input
                            type="number"
                            value={exclude_Tax}
                            min={0}
                            onChange={(e) => {
                              const value = (e.target.value);
                              if (value >= 0) {
                                setExclude_Tax(value); 
                              } else {
                                setExclude_Tax(0); 
                              }
                            }}
                            placeholder="0.0"
                            className=" input_text"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="">ប្រាក់ចំណេញ($)</label>
                          <input
                            type="number"
                            placeholder="0.0"
                            min={0}
                            value={(exclude_Tax - grandTotal).toFixed(2) }
                            readOnly
                            className="bg-gray-100 input_text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">កំណត់ព័ត៍មានផលិតផល</h3>
                      <div className="relative items-center gap-3 mx-auto my-2"></div>
                      <table className="w-full mt-4 border-collapse ">
                    <thead className="p-2 text-white bg-blue-600/90">
                      <tr>
                        <th className="p-2 border w-[10%]">
                          តម្លៃដើម(មិនរួមពន្ធ)
                        </th>
                        <th className="p-2 border w-[10%]">បូកពន្ធ</th>
                        <th className="p-2 border w-[15%]">តម្លៃលក់ដើម($)</th>
                        <th className="p-2 border w-[15%]">ប្រាក់ចំណេញ($)</th>
                        <th className="p-2 border w-[15%]">សរុប($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="number"
                            placeholder="តម្លៃដើម(មិនរួមពន្ធ)"
                            className="input_text"
                            value={cost_Price}
                            min={0}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value >= 0) {
                                setCost_Price(value); 
                              } else {
                                setCost_Price(0); 
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="តម្លៃដើម(រួមពន្ធ)"
                            className="input_text"
                            value={include_Tax}
                            min={0}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value >= 0) {
                                setInclude_Tax(value); 
                              } else {
                                setInclude_Tax(0); 
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="តម្លៃលក់ដើម"
                            className="input_text"
                            value={exclude_Tax}
                            min={0}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value >= 0) {
                                setExclude_Tax(value); 
                              } else {
                                setExclude_Tax(0); 
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="ប្រាក់ចំណេញ"
                            className="bg-gray-100 input_text"
                         value={profit}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="ប្រាក់សរុប"
                            value={amount}
                            className="bg-gray-100 input_text"
                            readOnly
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex justify-end mb-10'>
                <button
                  type="submit"

                  className="button_only_submit "
                >
                  រក្សាទុក្ខ
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default CreateProduct