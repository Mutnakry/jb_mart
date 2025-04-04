
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../Navbar'
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../../../service/api'

function CreateProduct() {

  const [ProNames, setProNames] = useState('');
  const [category_ID, setCategory_ID] = useState(null);
  const [brand_ID, setBrand_ID] = useState(null);
  const [unit_ID, setUnit_ID] = useState('');
  const [note_QTY, setNote_Qty] = useState(1);
  const [product_type, setProduct_type] = useState('មួយ');
  const [type_Tax, setType_Tax] = useState('ផ្ដាច់មុខ');
  const [description, setDescription] = useState(null);
  const [expiry, setExpiry] = useState(null);

  const [existingImage, setExistingImage] = useState(null);
  const [cost_Price, setCost_Price] = useState(0);
  const [exclude_Tax, setExclude_Tax] = useState(0);
  const [include_Tax, setInclude_Tax] = useState(0);
  const [profit, setProfit] = useState('');
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [enabled, setEnabled] = useState('enable');
  const [barcode_type, setBarcode_type] = useState('Code-128')
  const [userLoginNames, setUserLoginNames] = useState('');
  const [categorys, setCategorys] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [Units, setUnits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_names') || '');
    getALLCategorys();
    getALLBrands();
    getALLUnits();
  }, []);

  //// get all category
  const getALLCategorys = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategorys(response.data.categories);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  //// get all brands
  const getALLBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/brands`);
      setBrands(response.data.brands);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  //// get all unit
  const getALLUnits = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/unit`);
      setUnits(response.data.unit);
      console.log('/api/unit',response.data.unit)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };



  const handleToggle = () => {
    setEnabled(prev => (prev === 'enable' ? 'disable' : 'enable'));
  };

  const handleChangeProductType = (e) => {
    setProduct_type(e.target.value);
    setAmount("");
    setCost_Price("");
    setExclude_Tax("");
    setInclude_Tax("");

  };


  const [amount, setAmount] = useState(0)
  const calculateProfit = () => {
    const profit1 = exclude_Tax - (cost_Price + include_Tax);
    const amount1 = (cost_Price + include_Tax);
    setAmount(amount1)
    setProfit(profit1);
  };

  useEffect(() => {
    calculateProfit();
  }, [cost_Price, include_Tax, exclude_Tax]);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (file) {
      if (validImageTypes.includes(file.type)) {
        setFile(file);
        setImage(URL.createObjectURL(file)); // Preview image
        setError(null);
      } else {
        toast.error("សូមបញ្ចូលរូបភាព image.(jpeg,jpg,png,gif)", { autoClose: 2000 });
        setFile(null);
        setImage(null);
      }
    }
  };

  const ClearData = () => {
    setProNames("");
    setBrand_ID("");
    setUnit_ID("");
    setCategory_ID("");
    setNote_Qty("");
    setCost_Price("");
    setInclude_Tax("");
    setExclude_Tax("");
    setType_Tax("");
    setProfit("");
    setExpiry("");
    setFile(null);
    setImage(null);
    setError('');
  };

  const Createproduct = async (e) => {
    e.preventDefault();
    setError('');
    const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (file && !fileTypes.includes(file.type)) {
      setError('Error: Images Only (jpeg, jpg, png, gif)');
      return;
    }
    // Optionally, check file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
      setError('Error: File size exceeds 5MB');
      return;
    }
    const values = {
      pro_names: ProNames,
      category_id: category_ID ? category_ID : null,
      brand_id: brand_ID ? brand_ID : null,
      unit_id: unit_ID ? unit_ID : null,
      note_qty: note_QTY ? note_QTY : 0,
      mg_stock: enabled,
      cost_price: cost_Price,
      include_tax: include_Tax,
      exclude_tax: exclude_Tax,
      profit: profit,
      expiry: expiry,
      type_of_tax: type_Tax,
      product_type: product_type,
      file: file,
      description: description,
      user_at: userLoginNames,
      barcode_type: barcode_type,
    }
    console.log(values)
    try {
      await axios.post(`${API_URL}/api/product/create`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('បន្ថែមបានដោយជោគជ័យ!', { autoClose: 3000 });
      navigate('/product');
      ClearData();
    } catch (err) {
      console.error(err);
      toast.error('សូមលោកព្យាយាមម្ដងទៀត ស្មោះមានរួចហើយ !', { autoClose: 3000 });
    }

  };

  
  return (
    <div>
      <Navbar />
      <div className='py-12 px-6 sm:ml-64 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
        <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
        
          <div className='flex items-center gap-2 pb-5'>
            <p className='text-2xl font-bold font-NotoSansKhmer'>+ បង្កើតផលិតផលថ្មី </p>
          </div>

          <form className="" onSubmit={Createproduct}>
            <div className="">
              <div className='grid grid-cols-2 gap-4 mb-4 md:grid-cols-3'>
                <div className="col-span-1 space-y-2">
                  <label className="font-bold font-NotoSansKhmer">ឈ្មោះផលិតផល: *</label>
                  <input
                    type="text"
                    value={ProNames}
                    onChange={e => setProNames(e.target.value)}
                    id="price"
                    className="input_text "
                    placeholder="ឈ្មោះទំនិញ" required
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="font-bold font-NotoSansKhmer">ប្រភេទបាកូដ:*</label>
                  <select
                    name=""
                    value={barcode_type}
                    onChange={e => setBarcode_type(e.target.value)}
                    className='input_text'
                    id=""
                  >
                    <option value="Code-128">Code-128</option>
                    <option value="Code-39">Code-39</option>
                    <option value="EAN-13">EAN-13</option>
                    <option value="EAN-8">EAN-8</option>
                    <option value="UPCA-A">UPCA-A</option>

                  </select>
                </div>
              </div>
              <div className='p-4 mb-4 border-t-2 border-yellow-600 shadow'>
                <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ឯកតា:* </label>
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
                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ម៉ាកយីហោ:</label>
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
                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ប្រភេទទំនេញ:</label>
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

                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ថ្ងៃផុតកំណត់</label>
                    <input
                      type="date"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      id="price"
                      min={today}
                      className="input_text "
                    />
                  </div>


                  <div className="flex items-center justify-center">
                    <div className="col-span-1 space-y-2 text-center">
                      <label className="font-bold border-dashed rounded-lg cursor-pointer font-NotoSansKhmer bg-gray-50">
                        រូបភាពផលិតផល
                      </label>

                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                      >
                        {image ? (
                          <img src={image} alt="Uploaded Preview" className="object-contain w-full h-full rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-gray-400">រូបភាព</p>
                          </div>
                        )}
                        <input
                          id="dropzone-file"
                          type="file"
                          accept=".jpeg, .jpg, .png, .gif"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>


                  <div className="grid grid-cols-2 col-span-2 gap-5">
                    {/* Toggle Switch */}
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled === 'enable'}  // Check if enabled is 'enable'
                        onChange={handleToggle}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
                        {enabled === 'enable' ? 'គ្រប់គ្រងស្តុក' : 'បិទគ្រប់គ្រងស្តុក'}
                      </span>
                    </label>

                    {/* Input field only when stock management is enabled */}
                    {enabled === 'enable' && (
                      <div className="space-y-2">
                        <div className="col-span-1 space-y-2">
                          <label className="font-bold font-NotoSansKhmer">ជូនដំណឹងពីបរិមាណៈ</label>
                          <input
                            type="number"
                            value={note_QTY}
                            min={0}
                            onChange={e => setNote_Qty(e.target.value)}
                            className="input_text"
                            placeholder="ជូនដំណឹងពីបរិមាណ"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-3">
                    <label className="font-bold font-NotoSansKhmer">ការណិពណ័នា</label>
                    <textarea id="description"
                      rows="4"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="input_text"
                      placeholder="ការណិពណ័នា">
                    </textarea>
                  </div>
                </div>
              </div>

              <div className='p-4 mb-4 border-t-2 border-blue-600 shadow'>
                <div className='grid grid-cols-2 gap-4 mb-4 md:grid-cols-3'>
                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ប្រភេទផលិតផល: *</label>
                    <select
                      className='input_text'
                      value={product_type}
                      disabled
                      onChange={handleChangeProductType}
                    >
                      <option value="មួយ">មួយ</option>
                      {/* <option value="កញ្ចប់">កញ្ចប់</option> */}
                    </select>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="font-bold font-NotoSansKhmer">ប្រភេទពន្ធលើតម្លៃលក់: *</label>
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
                          <th className="p-2 border w-[15%]">តម្លៃលក់($)</th>
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
                              step={0.01}
                              required
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
                              step={0.01}
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
                              step={0.01}
                              required
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
              </div>
              <div className='flex justify-end py-4 mb-10 space-x-4'>
                <button
                  name='savetoproduct'
                  type="submit"
                  className="flex items-center justify-center px-16 py-2 text-center text-white transition bg-blue-500 button_only_submit hover:bg-blue-600"
                >
                  រក្សាទុក
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