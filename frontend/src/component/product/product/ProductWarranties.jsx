import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCcApplePay, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {API_URL} from '../../../service/api'

const ProductWarranties = () => {
  const [userLoginNames, setUserLoginNames] = useState('');
  const [warrentys, setWarrentys] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('ថ្ងៃ');
  const [pro_names, setPro_names] = useState('');
  const [description, setdescription] = useState('');
  const [error, setError] = useState('');

  // Set the user login name and fetch warranties on component mount
  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_rol') || '');
    getAllWarrenty();
    getProduct();
  }, []);

  // Fetch all warranties from the API
  const getAllWarrenty = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/warranty`);
      setWarrentys(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching categories data');
    }
  };
  const getProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/all`);

      setProducts(response.data);
      console.log(response.data)
      setError(null);
    } catch (error) {
      setError('Error fetching categories data');
    }
  };

  // Handle changes to the search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter warranties based on the search query
  const filteredWarrentys = warrentys.filter((warranty) =>
    warranty.pro_names.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  /// show modal insert
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedaccountId, setSelectedaccountId] = useState(null);

  const openDeleteModal = (warranty) => {
    setSelectedaccountId(warranty.id);
    setIsDeleteModalOpen(true);
  };

  const deleteWarranty = async () => {
    try {
      await axios.delete(`${API_URL}/api/warranty/${selectedaccountId}`);
      toast.success('Warranty deleted successfully!', { autoClose: 3000 });
      getAllWarrenty();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting warranty. Please try again!', { autoClose: 3000 });
    }
  };

  // modal insert
  const openInsertModal = () => {
    setIsInsertModalOpen(true);
  };

  const openUpdateModal = (warranty) => {
    setSelectedaccountId(warranty.id);
    setPro_names(warranty.product_id);
    setDuration(warranty.duration);
    setType(warranty.type);
    setdescription(warranty.description);
    setIsUpdateModalOpen(true);
  };

  const ClearData = () => {
    setDuration('');
    setPro_names("");
    setType('ថ្ងៃ')
    setdescription("");
  }

  // greate warrenty
  const CreateWarrenty = async (e) => {
    e.preventDefault();
    setError('');
    const values = {
      product_id: pro_names,
      duration: duration,
      type: type,
      description: description,
    }
    try {
      const res = await axios.post(`${API_URL}/api/warranty`, values);
      toast.success('បង្កើតបានដោយជោគជ័យ ', { autoClose: 3000 });
      console.log(res.data);
      ClearData();
      getAllWarrenty();
      setIsInsertModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
    }
  };


  const UpdateAccount = async (e) => {
    e.preventDefault();
    setError('');
    const values = {
      product_id: pro_names,
      duration: duration,
      type: type,
      description: description,
    };

    try {
      const res = await axios.put(`${API_URL}/api/warranty/${selectedaccountId}`, values);
      toast.success('ការកែប្រែបានជោគជ័យ', { autoClose: 3000 }); // Success message
      ClearData();
      getAllWarrenty(); // Refresh the warranties list
      setIsUpdateModalOpen(false); // Close the update modal
    } catch (err) {
      console.error(err);
      toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 }); // Error message
    }
  };


  return (
    <div>
      <Navbar />
      <div className='Nav_bar'>
      <div className=' Div_bar'>
        <div className="flex items-center gap-2 mb-3">
            <p><FaCcApplePay className="text-lg" /></p>
            <p className="font-bold font-NotoSansKhmer">តារាងបញ្ជី</p>
          </div>
          <div className="flex justify-end">
            <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតផលិតផលថ្មី</button>
          </div>
          <div className='pb-4'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="input_text w-[300px]"
              placeholder="ស្វែងរកផលិតផល..."
            />
          </div>

          <div className="relative h-screen overflow-x-auto scrollbar-hidden">
            <AnimatePresence>

              <table className="min-w-full table-auto">
                <thead className="text-white bg-blue-600/95">
                  <tr className="font-bold font-NotoSansKhmer">
                    <th className="px-4 py-2">លេខរៀង</th>
                    <th className="px-4 py-2">ឈ្មោះទំនិញ</th>
                    <th className="px-4 py-2">រយៈពេល</th>
                    <th className="px-4 py-2">ព័ត៌មានលម្អិតគណនី</th>
                    <th className="px-4 py-2 text-center">សកម្មភាព</th>
                  </tr>
                </thead>
                {searchQuery && filteredWarrentys.length === 0 ? (
                  <div className="py-4 text-center text-red-500">រកមិនឃើញផលិតផល "{searchQuery}"</div>
                ) : (
                  <tbody>
                    {filteredWarrentys.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={rowAnimation}
                        transition={{ duration: 0.3 }}
                        className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110"
                      >
                        <td className="px-4 py-1">{index + 1}</td>
                        <td className="px-4 py-1">{customer.pro_names}</td>
                        <td className="px-4 py-1 capitalize">{customer.duration} {customer.type}</td>
                        <td className="px-4 py-1">{customer.description || 'N/A'}</td>
                        <td className="flex px-4 space-x-2">
                          <button
                            onClick={() => openUpdateModal(customer)}
                            className="flex p-2 text-xs text-white bg-blue-500"
                          >
                            <FaPencilAlt className="text-white " /> 
                          </button>
                          {/* <button
                            onClick={() => openDeleteModal(customer)}
                            className="flex p-2 text-xs text-white bg-red-500"
                          >
                            <MdDelete className="text-white" />
                          </button> */}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                )}
              </table>

            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Insert Modal */}
      < AnimatePresence >
        {isInsertModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-xl modal_center">
              <div className="modal_title">
                <h3 className="">ផលិតផល</h3>
                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
              </div>
              <div className="modal_form">
                <form className="" onSubmit={CreateWarrenty}>
                  <div className="">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="font-bold font-NotoSansKhmer">ឈ្មោះផលិតផល: *</label>
                        <select
                          className='input_text'
                          id="bank"
                          value={pro_names}
                          required
                          onChange={e => setPro_names(e.target.value)}
                        >
                          <option value="">ជ្រើសរើសប្រភេទគណនី</option>
                          {products?.map((items) => (
                            <option key={items.id} value={items.id}>
                              {items.pro_names}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-1">
                        <label className="font-bold font-NotoSansKhmer">រយៈពេល:*</label>
                        <input
                          type="number"
                          value={duration}
                          onChange={e => setDuration(e.target.value)}
                          id="price"
                          className="input_text "
                          placeholder="រយៈពេល" required
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="font-bold font-NotoSansKhmer">ប្រភេទ: *</label>
                        <select
                          className='input_text'
                          id="bank"
                          value={type}
                          required
                          onChange={e => setType(e.target.value)}
                        >
                          <option value="ថ្ងៃ" >ថ្ងៃ</option>
                          <option value="ខែ" >ខែ</option>
                          <option value="ឆ្នាំ" >ឆ្នាំ</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="font-bold font-NotoSansKhmer">ចំណាំ</label>
                        <textarea id="description"
                          rows="4"
                          value={description}
                          onChange={e => setdescription(e.target.value)}
                          className="input_text"
                          placeholder="ចំណាំ">
                        </textarea>
                      </div>
                    </div>
                    <div className='flex justify-end'>
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
          </motion.div>
        )}
      </AnimatePresence >

      {/* Delete Modal */}
      < AnimatePresence >
        {isDeleteModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-sm modal_center">
              <div className="modal_title">
                <h3 className="">លុបប្រគណនី</h3>

                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm ">
                  Are you sure you want to delete this account? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="button_only_close"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    មិនលុប
                  </button>
                  <button
                    type="button"
                    className="button_only_submit"
                    onClick={deleteWarranty}
                  >
                    លុប
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence >
      
      {/* update */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-xl modal_center">
              <div className="modal_title">
                <h3>កែប្រែផលិតផល</h3>
                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />
              </div>
              <div className="modal_form">
                <form onSubmit={UpdateAccount}>
                  <div className="">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="font-bold font-NotoSansKhmer">ឈ្មោះផលិតផល: *</label>
                        <select
                          className="input_text"
                          value={pro_names}
                          onChange={(e) => setPro_names(e.target.value)}
                          required
                        >
                          <option value="">ជ្រើសរើសផលិតផល</option>
                          {products?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.pro_names}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label className="font-bold font-NotoSansKhmer">រយៈពេល:*</label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="input_text"
                          placeholder="រយៈពេល"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="font-bold font-NotoSansKhmer">ប្រភេទ: *</label>
                        <select
                          className="input_text"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                        >
                          <option value="ថ្ងៃ">ថ្ងៃ</option>
                          <option value="ខែ">ខែ</option>
                          <option value="ឆ្នាំ">ឆ្នាំ</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="font-bold font-NotoSansKhmer">ចំណាំ</label>
                        <textarea
                          value={description}
                          onChange={(e) => setdescription(e.target.value)}
                          className="input_text"
                          placeholder="ចំណាំ"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="button_only_submit">
                        រក្សាទុក
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductWarranties;
