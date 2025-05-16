
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaFileCsv, FaFileExcel, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import NullImage from '../../assets/image.png';
import { API_URL } from '../../service/api'


const Dashboard = () => {
  const [error, setError] = useState('');
  const [userLoginNames, setUserLoginNames] = useState('');

  //// paginate and search data
  const [product, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);


  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_names') || '');
    getAllProduct();
  }, [page, limit, searchQuery]);

  //// get all product add paginate and search
  const getAllProduct = async () => {
    setLoading(true);  // Set loading state to true
    try {
      const response = await axios.get(`${API_URL}/api/product`, {
        params: {
          page,
          limit,
          search_query: searchQuery
        }
      });
      setProducts(response.data.product);
      setTotalPages(response.data.totalPages);
      setError(null);  // Reset error state if request is successful
    } catch (error) {
      setError('Error fetching api/product data');  // Set error state if request fails
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedproductId, setSelectedproductId] = useState(null);

  // modal delete
  const openDeleteModal = cat => {
    setSelectedproductId(cat.id);
    setIsDeleteModalOpen(true);
  };

  // modale delete
  const deleteproduct = async () => {
    if (selectedproductId) {
      try {
        await axios.delete(`${API_URL}/api/product/${selectedproductId}`);
        toast.success('លុបបានដោយជោគជ័យ!', { autoClose: 3000 });
        getAllProduct();
        setIsDeleteModalOpen(false);
        setSelectedproductId(null);
      } catch (err) {
        console.error(err);
        toast.error('សូមលោកព្យាយាមម្ដងទៀត ស្មោះមានរួចហើយ !', { autoClose: 3000 });
      }
    }
  };

  /// show modal insert
  const [IsModalUpdateStatus, setIsModalUpdateStatus] = useState(false);
  const [status, setStatus] = useState('');

  // modal update 
  const openUpdateModal = cat => {
    setSelectedproductId(cat.id);
    setStatus(cat.status);
    console.log(cat.status);
    setIsModalUpdateStatus(true);
  };

  // modal update  statis
  const UpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    const values = {
      status: status,
    };
    try {
      await axios.put(`${API_URL}/api/product/updateproduct_status/${selectedproductId}`, values);
      toast.success('កែប្រែបានដោយជោគជ័យ', { autoClose: 3000 });
      console.log(status);
      getAllProduct();
      setIsModalUpdateStatus(false);
      setSelectedproductId(null);
    } catch (err) {
      console.error(err);
      toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
    }
  };

  const rowAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };


  return (
    <div>
      <div>
        <div className="flex items-center gap-2 ">
          <p><FaClipboardList className="text-lg " /></p>
          <p className="font-bold font-NotoSansKhmer ">តារាងបញ្ជីប្រភេទទំនិញ</p>
        </div>
        <div className="flex justify-end">
          <Link to={'/createproduct'} className="button_only_submit">+ បង្កើតប្រភេទថ្មី</Link>
        </div>
        <div className="items-center justify-between my-3 space-y-2 overflow-hidden md:flex">
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
        <div className="relative h-screen overflow-x-auto scrollbar-hidden">
          <AnimatePresence>
            <table className="min-w-full table-auto">
              <thead className="text-white bg-blue-600/95">
                <tr className="text-sm font-bold font-NotoSansKhmer">
                  <th className="px-4 py-2 ">លេខរៀង</th>
                  <th className="px-4 py-2 whitespace-nowrap">ឈ្មោះផលិតផល</th>
                  <th className="px-4 py-2 ">ប្រភេទទំនិញ</th>
                  <th className="px-4 py-2 ">ម៉ាលយីយោ</th>
                  <th className="px-4 py-2 ">ប្រភេទផលិតផល</th>
                  <th className="px-4 py-2 ">បង្កើតនៅថ្ងៃទី</th>
                  <th className="px-4 py-2 ">តម្លៃទិញចូលក្នុងមួយឯកតា</th>
                  <th className="px-4 py-2 ">តម្លៃលក់ចេញក្នុងមួយឯកតា</th>
                  <th className="px-4 py-2 ">ពន្ធ</th>
                  <th className="px-4 py-2 ">តម្លៃចំនេញ</th>
                  <th className="px-4 py-2 ">បច្ចុប្បន្នភាពស្តុក</th>
                  <th className="px-4 py-2 ">សរុបចំនួនស្តុក</th>
                  <th className="px-4 py-2 ">ចំនួនលក់សរុប sto - qt</th>
                  <th className="px-4 py-2 ">	តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃទិញចូល)</th>
                  <th className="px-4 py-2 ">តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃលក់ចេញ)</th>
                  <th className="px-4 py-2 ">សាច់ប្រាក់ចំណេញសក្ដានុពល</th>
                  <th className="px-4 py-2 ">សកម្មភាព</th>
                </tr>
              </thead>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : product.length === 0 ? (
                <p className="px-10 py-4 text-red-500 text-start whitespace-nowrap ">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
              ) : (
                <tbody>
                  {product.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={rowAnimation}
                      transition={{ duration: 0.3 }}
                      className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">
                      <td className="px-4 py-1 ">{index + 1}</td>
                      <td className='whitespace-nowrap'>
                        {(() => {
                          if (!product.expiry) {
                            return <span className="">{product.pro_names}</span>;
                          }

                          const expiryDate = new Date(product.expiry);
                          if (isNaN(expiryDate.getTime())) {
                            return <span className="">{product.pro_names}</span>;
                          }

                          const today = new Date();
                          const next7Days = new Date(today);
                          const next15Days = new Date(today);

                          next7Days.setDate(today.getDate() + 7);
                          next15Days.setDate(today.getDate() + 15);

                          if (expiryDate < today) {
                            return <span className="text-red-500">{product.pro_names}</span>;
                          } else if (expiryDate <= next7Days) {
                            return <span className="text-blue-500">{product.pro_names}</span>;
                          } else if (expiryDate <= next15Days) {
                            return <span className="text-green-500">{product.pro_names}</span>;
                          } else {
                            return <span>{product.pro_names}</span>;
                          }
                        })()}
                      </td>
                      <td className="px-4 py-1 ">{product.cat_names || 'N/A'}</td>
                      <td className="px-4 py-1">{product.brand_names || 'N/A'}</td>
                      <td className="px-4 py-1 ">{product.product_type || 'N/A'}</td>
                      <td className="px-4 py-1 whitespace-nowrap">{formatDateToKhmer(new Date(product.create_at))}</td>

                      <td className="px-4 py-1 whitespace-nowrap">{product.cost_price} $</td>
                      <td className="px-4 py-1 whitespace-nowrap">{product.exclude_tax} $</td>
                      <td className="px-4 py-1 whitespace-nowrap">{product.include_tax} $</td>
                      <td className="px-4 py-1 whitespace-nowrap">{product.profit} $</td>
                      {/* <td className="px-4 py-1 whitespace-nowrap">{product.qty} {product.unit_names}111</td> */}
                      <td className="px-4 py-1">
                        <button className=''>
                          {product.mg_stock === 'enable' ? (
                            <span  > {product.qty} {product.unit_names}</span>
                          ) : (
                            <span className=' text-blue-700 text-xs'>មិនគ្រប់គ្រងស្តុក</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap">{product.stock} {product.unit_names}</td>
                      <td className="px-4 py-1 whitespace-nowrap">{(product.stock) - (product.qty)} {product.unit_names}</td>
                      <td className="px-4 py-1 whitespace-nowrap">{((product.cost_price) * (product.qty)).toFixed(2)} $</td>
                      <td className="px-4 py-1 whitespace-nowrap">{((product.exclude_tax) * (product.qty)).toFixed(2)} $</td>
                      <td className="px-4 py-1 whitespace-nowrap">{((product.profit) * (product.qty)).toFixed(2)} $</td>
                      <td className="flex px-4 space-x-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex items-center gap-1 p-2 font-bold text-white bg-green-300 hover:bg-green-400"

                        >
                          <IoPrint />
                        </Link>
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

    </div>
  );
};
export default Dashboard;