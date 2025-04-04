
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import {API_URL} from '../../service/api'



const Dashboard = () => {
  const [names, setNames] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  //// paginate and search data
  const [category, setStudent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [UserLogin_Name, setUserLogin_Name] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('names');
    setUserLogin_Name(storedUsername);
    getAllStudent();
  }, [page, limit, searchQuery]);

  //// get all category add paginate and search
  const getAllStudent = async () => {
    setLoading(true);  // Set loading state to true
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        params: {
          page,
          limit,
          search_query: searchQuery
        }
      });
      setStudent(response.data.categories);
      setTotalPages(response.data.totalPages);
      setError(null);  // Reset error state if request is successful
    } catch (error) {
      setError('Error fetching categories data');  // Set error state if request fails
    } finally {
      setLoading(false);  // Set loading state to false
    }
  };
  /// page total
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  //// search data
  const handleSearch = (event) => {
    if (setPage(0)) {
      alert('not found!')
    } else {
      setSearchQuery(event.target.value);
      setPage(1); // Reset to the first page on search 
    }

  };

  /// show modal insert
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // modal insert
  const openInsertModal = () => {
    setIsInsertModalOpen(true);
    setNames('');
    setDetail('');
  };
  // modal update 
  const openUpdateModal = cat => {
    setSelectedCategoryId(cat.id);
    setDetail(cat.detail);
    setNames(cat.cat_names);
    setIsUpdateModalOpen(true);
  };
  // modal update 
  const UpdateTeacher = async e => {
    e.preventDefault();
    setError('');
    const values = {
      cat_names: names,
      detail: detail,
    }
    try {
      await axios.put(`${API_URL}/categories/${selectedCategoryId}`, values);
      toast.success(`កែប្រែបានដោយជោគជ័យ ​« ${names} »`, { autoClose: 3000 });
      getAllStudent();
      setIsUpdateModalOpen(false);
      setSelectedCategoryId(null);
      setNames('');
      setDetail('');
    } catch (err) {
      console.error(err);
      toast.error(`សូមលោកព្យាយាមម្ដងទៀត ​« ${names} » ស្មោះមានរួចហើយ !`, { autoClose: 3000 });
    }
  };


  // modal delete
  const openDeleteModal = cat => {
    setSelectedCategoryId(cat.id);
    setIsDeleteModalOpen(true);
    setNames(cat.cat_names);
  };

  // modale delete
  const deleteCategory = async () => {
    if (selectedCategoryId) {
      try {
        await axios.delete(`${API_URL}/categories/${selectedCategoryId}`);
        toast.success(`លុបបានដោយជោគជ័យ  ​« ${names} » `, { autoClose: 3000 });
        getAllStudent();
        setIsDeleteModalOpen(false);
        setSelectedCategoryId(null);
      } catch (err) {
        console.error(err);
        // toast.error('សូមលោកព្យាយាមម្ដងទៀត ស្មោះមានរួចហើយ !', { autoClose: 3000 });

        toast.error(`សូមលោកព្យាយាមម្ដងទៀត ស្មោះ ​« ${names} »មានរួចហើយ !`, { autoClose: 3000 });
      }
    }
  };

  // greate category
  const CreateCategory = async (e) => {
    e.preventDefault();
    setError('');
    const values = {
      cat_names: names,
      detail: detail,
    }
    try {
      const res = await axios.post(`${API_URL}/categories`, values);
      console.log(res.data);
      toast.success(`បង្កើតបានដោយជោគជ័យ  ​« ${names} »`, { autoClose: 3000 });
      setNames('');
      setDetail('');
      getAllStudent();
      setIsInsertModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`សូមលោកព្យាយាមម្ដងទៀត ស្មោះ ​« ${names} » មានរួចហើយ !`, { autoClose: 3000 });
    }
  };
  const rowAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };



  return (
    <div>
      <div className='border p-4 border-gray-200 dark:border-gray-700'>
        <div className="flex items-center mb-3 gap-2 ">
          <p><FaClipboardList className="text-lg " /></p>
          <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីប្រភេទទំនិញ</p>
        </div>
        <div className="flex justify-end">
          <button onClick={openInsertModal} className="button_only_submit">+ បង្កើតប្រភេទថ្មី</button>
        </div>
        <div className="flex justify-between items-center my-3">
          <div className="flex flex-col gap-2 font-bold font-NotoSansKhmer">
            <label htmlFor="">ច្រោះតាមចំនួន</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input_text w-[100px]">
              {[25, 50, 100, 500].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
         
          <div>
            <input type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="input_text w-[300px]" placeholder="ស្វែងរកអ្នកផ្គត់ផ្គង់..." />
          </div>
        </div>
        <div class="relative overflow-x-auto h-screen scrollbar-hidden">
          <AnimatePresence>
            <table className="min-w-full table-auto">
              <thead className="bg-blue-600/95 text-white">
                <tr className="font-NotoSansKhmer font-bold">
                  <th className=" px-4 py-2">លេខរៀង</th>
                  <th className=" px-4 py-2">ឈ្មោះប្រភេទផលិតផល</th>
                  <th className=" px-4 py-2">ការណិពណ័នា</th>
                  <th className=" px-4 py-2">បង្កើត</th>

                  <th className=" px-4 py-2">សកម្មភាព</th>

                </tr>
              </thead>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : category.length === 0 ? (
                <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
              ) : (
                <tbody>
                  {category.map((categorys, index) => (
                    <motion.tr
                      key={categorys.id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={rowAnimation}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100">
                      <td className=" px-4 py-1">{index + 1}</td>
                      <td className="px-4 py-1">{categorys.cat_names}</td>
                      <td className=" px-4 py-1">{categorys.detail || 'N/A'}</td>
                      <td className=" px-4 py-1">{formatDateToKhmer(new Date(categorys.create_at))}</td>

                      <td className="px-4  space-x-2 flex">
                        <button
                          onClick={() => openDeleteModal(categorys)}
                          className='bg-red-50 rounded-full p-2 '
                        >
                          <MdDelete className='text-red-500' />
                        </button>
                        <button
                          onClick={() => openUpdateModal(categorys)}
                          className='bg-blue-50 rounded-full p-2 '                        >
                          <FaPencilAlt className='text-blue-500' />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              )}
            </table>
          </AnimatePresence>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            limit={limit}
            setLimit={setLimit}
          />

        </div>

      </div>



      {/* Insert Modal */}
      <AnimatePresence>
        {isInsertModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal_center max-w-sm">
              <div className="modal_title">
                <h3 className="">ប្រភេទទំនិញ</h3>
                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
              </div>
              <div className="modal_form">
                <form class="" onSubmit={CreateCategory}>
                  <div className="">
                    <div class="grid gap-4 mb-4 grid-cols-2">
                      <div class="col-span-2">
                        <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                        <input
                          type="text"
                          value={names}
                          onChange={e => setNames(e.target.value)}
                          id="price"
                          class="input_text "
                          placeholder="ឈ្មោះនៃប្រភេទទំនិញ" required
                        />
                      </div>
                      <div class="col-span-2">
                        <label className="font-NotoSansKhmer font-bold">ការណិពណ័នា</label>
                        <textarea id="description"
                          rows="4"
                          value={detail}
                          onChange={e => setDetail(e.target.value)}
                          class="input_text"
                          placeholder="ការណិពណ័នា">
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
      </AnimatePresence>
      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal_center max-w-sm">
              <div className="modal_title">
                <h3 className="">លុបប្រភេទទំនិញ</h3>

                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm ">
                តើអ្នកប្រាកដថាចង់លុបប្រភេទ ​« {names} ​»​ នេះទេ?  សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
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
                    onClick={deleteCategory}
                  >
                    លុប
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Update Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal_center max-w-sm">
              <div className="modal_title">
                <h3 className="">កែប្រែប្រភេទទំនិញ</h3>
                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

              </div>
              <div className="modal_form">
                <form class="" onSubmit={UpdateTeacher}>

                  <div class="grid gap-4 mb-4 grid-cols-1">
                    <div class="col-span-2">
                      <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                      <input
                        type="text"
                        value={names}
                        onChange={e => setNames(e.target.value)}
                        id="price"
                        class="input_text "
                        placeholder="ឈ្មោះនៃប្រភេទទំនិញ" required
                      />
                    </div>
                    <div class="col-span-2">
                      <label className="font-NotoSansKhmer font-bold">ការណិពណ័នា</label>
                      <textarea id="description"
                        rows="4"
                        value={detail}
                        onChange={e => setDetail(e.target.value)}
                        class="input_text"
                        placeholder="ការណិពណ័នា">
                      </textarea>
                    </div>
                  </div>
                  <div className='flex items-end justify-end'>
                    <button
                      type="submit"
                      className="button_only_submit"
                    >
                      រក្សាទុក្ខ
                    </button>
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

export default Dashboard;
