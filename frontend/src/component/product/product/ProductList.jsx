
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToKhmer } from '../../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import NullImage from '../../../assets/image.png';
import { API_URL } from '../../../service/api'


const Dashboard = () => {
    const [error, setError] = useState('');
    const [userLoginNames, setUserLoginNames] = useState('');
    const [userRol, setUserRol] = useState('');

    //// paginate and search data
    const [product, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);


    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        setUserRol(localStorage.getItem('user_rol') || '');
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
            setError(null);
        } catch (error) {
            setError('Error fetching api/product data');
        } finally {
            setLoading(false);
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
                toast.error('សូមលោកព្យាយាមម្ដងទៀត ស្មោះនេះមានមាននៅក្នុងរបាយការរួចហើយ', { autoClose: 3000 });
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

    const [showRowActions, setShowRowActions] = useState(null);


    // const [mgStockFilter1, setMgStockFilter1] = useState("all");

    // const filteredProducts1 = product.filter((item) => {
    //     if (mgStockFilter === "all") return true;
    //     return item.status === mgStockFilter;
    // });
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };


    const [filters, setFilters] = useState({
        mgStockFilter: 'all',
        expiryFilter: 'all',
        searchQuery: '',
        // Add other filters as needed
    });

    const today = new Date();
    const next7Days = new Date(today);
    const next15Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    next15Days.setDate(today.getDate() + 15);

    const filteredProducts = product.filter((product) => {
        // Filter by stock status
        if (filters.mgStockFilter !== 'all' && product.status !== filters.mgStockFilter) {
            return false;
        }

        // Filter by expiry date
        const expiryDate = new Date(product.expiry);
        if (filters.expiryFilter === 'expired' && expiryDate >= today) {
            return false;
        }
        if (filters.expiryFilter === '7days' && (expiryDate < today || expiryDate > next7Days)) {
            return false;
        }
        if (filters.expiryFilter === '15days' && (expiryDate < today || expiryDate > next15Days)) {
            return false;
        }

        // Filter by search query
        if (filters.searchQuery && !product.pro_names.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });


    return (
        <div>
            <div>
                <div className="flex items-center gap-2 ">
                    <p><FaClipboardList className="text-lg " /></p>
                    <p className="font-bold font-NotoSansKhmer ">តារាងបញ្ជីផលិតផល</p>
                </div>
                <div className="flex justify-end">
                    {(userRol === 'superadmin' || userRol === 'admin') ? (
                        <Link to={'/createproduct'} className="button_only_submit">+ បង្កើតផលិតផលថ្មី</Link>

                    ) : (
                        <button to={'/createproduct'} className="opacity-50 cursor-not-allowed button_only_submit">+ បង្កើតផលិតផលថ្មី</button>

                    )}
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
                    <div className='grid  xl:grid-cols-3 lg:grid-cols-1 space-x-4'>
                        <div className="flex flex-col gap-2 font-bold font-NotoSansKhmer">
                            <label htmlFor="">រកតាមថ្ងៃផុតកំណត់</label>

                            <select
                                name="expiryFilter"
                                value={filters.expiryFilter}
                                onChange={handleFilterChange}
                                className="input_text w-[300px]"
                            >
                                <option value="all">មើលទាំងអស់</option>
                                <option value="expired">ថ្ងៃផុតកំណត់</option>
                                <option value="7days">នៅសល់៧ថ្ងៃផុតកំណត់</option>
                                <option value="15days">នៅសល់15ថ្ងៃផុតកំណត់</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 font-bold font-NotoSansKhmer">
                            <label htmlFor="">កំពុងលក់ / បិទការលក់</label>

                            {/* Filter by mg_stock (active/inactive) */}
                            <select
                                name="mgStockFilter"
                                value={filters.mgStockFilter}
                                onChange={handleFilterChange}
                                className="input_text w-[300px]"
                            >
                                <option value="all">មើលទាំងអស់</option>
                                <option value="active">កំពុងលក់</option>
                                <option value="inactive">បិទការលក់</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 font-bold font-NotoSansKhmer">
                            <label htmlFor=""><br /></label>

                            <input type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="input_text w-[300px]" placeholder="ស្វែងរកផលិតផល..." />
                        </div>
                    </div>
                </div>
                <div className="relative h-screen overflow-x-auto scrollbar-hidden">
                    <AnimatePresence>
                        <table className="min-w-full table-auto">
                            <thead className="text-white bg-blue-600/95">
                                <tr className="font-bold font-NotoSansKhmer">
                                    <th className="px-4 py-2 ">លេខរៀង</th>
                                    <th className="px-4 py-2 whitespace-nowrap">រូបភាព</th>
                                    <th className="px-4 py-2 whitespace-nowrap">ឈ្មោះផលិតផល</th>
                                    <th className="px-4 py-2 ">តម្លៃទិញឯកតា</th>
                                    <th className="px-4 py-2 ">តម្លៃលក់</th>
                                    <th className="px-4 py-2 ">ពន្ធ</th>
                                    <th className="px-4 py-2 ">បញ្ចុះតម្លៃ</th>
                                    <th className="px-4 py-2 ">បច្ចុប្បន្នភាពស្តុក</th>
                                    <th className="px-4 py-2 ">ប្រភេទផលិតផល</th>
                                    <th className="px-4 py-2 ">ប្រភេទទំនិញ</th>
                                    <th className="px-4 py-2 ">ម៉ាលយីយោ</th>
                                    <th className="px-4 py-2 ">ប្រភេទស្តុក</th>
                                    <th className="px-4 py-2 ">ស្ថានភាព</th>
                                    <th className="px-4 py-2 ">ថ្ងៃផុតកំណត់</th>
                                    <th className="px-4 py-2 ">បន្ថែមដោយ</th>
                                    <th className="px-4 py-2 ">បង្កើត</th>

                                    <th className="px-4 py-2 ">ការណិពណ័នា</th>
                                    <th className="px-4 py-2 ">សកម្មភាព</th>

                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : filteredProducts.length === 0 ? (
                                <p className="px-10 py-4 text-red-500 text-start whitespace-nowrap ">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                            ) : (
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <motion.tr
                                            key={product.id}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={rowAnimation}
                                            transition={{ duration: 0.3 }}
                                            className="relative text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">
                                            <td className="px-4 py-1 ">{index + 1}</td>
                                            <td>
                                                {product.image ? (
                                                    <div className="flex items-center justify-center h-12">
                                                        <img
                                                            src={`${API_URL}/image/${product.image}`}
                                                            alt={product.pro_names}
                                                            className="object-contain w-full h-full mb-2 rounded"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-12">
                                                        <img
                                                            src={NullImage}
                                                            alt={product.pro_names}
                                                            className="object-contain w-full h-full mb-2 rounded"
                                                        />
                                                    </div>
                                                )}
                                            </td>

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
                                            <td className="px-4 py-1 whitespace-nowrap">{product.cost_price} $</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{product.exclude_tax} $</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{product.include_tax} $</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{product.discount} $</td>
                                            <td className="px-4 py-1">{product.qty} {product.unit_names}</td>
                                            <td className="px-4 py-1 ">{product.product_type || 'N/A'}</td>
                                            <td className="px-4 py-1 ">{product.cat_names || 'N/A'}</td>
                                            <td className="px-4 py-1">{product.brand_names || 'N/A'}</td>
                                            <td className="px-4 py-1 whitespace-nowrap">
                                                <button className=''>
                                                    {product.mg_stock === 'enable' ? (
                                                        <span >គ្រប់គ្រងស្តុក</span>
                                                    ) : (
                                                        <span >មិនគ្រប់គ្រងស្តុក</span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-1 whitespace-nowrap">
                                                {(userRol === 'superadmin' || userRol === 'admin') ? (
                                                    <button onClick={() => openUpdateModal(product)}>
                                                        {product.status === 'active' ? (
                                                            <span className='px-2 text-xs text-white bg-green-500 rounded hover:bg-green-300 dark:bg-green-300'>កំពុងលក់</span>
                                                        ) : (
                                                            <span className='px-2 text-xs text-white bg-red-500 rounded hover:bg-red-300 dark:bg-red-300'>បិទការលក់</span>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button className='opacity-50 cursor-not-allowed'>
                                                        {product.status === 'active' ? (
                                                            <span className='px-2 text-white bg-green-500 rounded hover:bg-green-300 dark:bg-green-300'>កំពុងលក់</span>
                                                        ) : (
                                                            <span className='px-2 text-white bg-red-500 rounded hover:bg-red-300 dark:bg-red-300'>បិទការលក់</span>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                {(() => {
                                                    if (!product.expiry) {
                                                        return <span className="">មិនមាន</span>;
                                                    }

                                                    const expiryDate = new Date(product.expiry);
                                                    if (isNaN(expiryDate.getTime())) {
                                                        return <span className="">មិនមាន</span>;
                                                    }

                                                    const today = new Date();
                                                    const next7Days = new Date(today);
                                                    const next15Days = new Date(today);

                                                    next7Days.setDate(today.getDate() + 7);
                                                    next15Days.setDate(today.getDate() + 15);

                                                    if (expiryDate < today) {
                                                        return <span className="text-red-500">{formatDateToKhmer(new Date(product.expiry))}</span>;
                                                    } else if (expiryDate <= next7Days) {
                                                        return <span className="text-blue-500">{formatDateToKhmer(new Date(product.expiry))}</span>;
                                                    } else if (expiryDate <= next15Days) {
                                                        return <span className="text-green-500">{formatDateToKhmer(new Date(product.expiry))}</span>;
                                                    } else {
                                                        return <span>{formatDateToKhmer(new Date(product.expiry))}</span>;
                                                    }
                                                })()}

                                            </td>
                                            <td className="px-4 py-1 ">{product.user_at}</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{formatDateToKhmer(new Date(product.create_at))}</td>

                                            <td className="px-4 py-1 ">
                                                <span>{product.description || 'មិនមាន'}</span>
                                            </td>
                                            <td className="relative px-4 py-1">
                                                {/* Button to Toggle   */}
                                                <button
                                                    onClick={() => setShowRowActions(prev => (prev === product.id ? null : product.id))}
                                                    className="px-4 py-1 bg-gray-300"
                                                >
                                                    សកម្មភាព
                                                </button>

                                                {showRowActions === product.id && (
                                                    <div className="z-50 p-3 mt-1 text-center bg-white rounded-md drop-shadow w-44">
                                                        {userRol === "superadmin" || userRol === "admin" ? (
                                                            <>
                                                                <button onClick={() => openDeleteModal(product)} className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                                                                    <MdDelete className="inline mr-2" />លុប
                                                                </button>
                                                                <Link to={`/updateproduct/${product.id}`} className="block w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100">
                                                                    <FaPencilAlt className="inline mr-2" />កែប្រែ
                                                                </Link>
                                                                <Link to={`/product/${product.id}`} className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100">
                                                                    <IoPrint className="inline mr-2" />បោះពុម្ព
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="block w-full px-4 py-2 text-left text-red-500 opacity-50 cursor-not-allowed">
                                                                    <MdDelete className="inline mr-2" />លុប
                                                                </button>
                                                                <span className="block w-full px-4 py-2 text-left text-blue-500 opacity-50 cursor-not-allowed">
                                                                    <FaPencilAlt className="inline mr-2" />កែប្រែ
                                                                </span>
                                                                <Link to={`/product/${product.id}`} className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100">
                                                                    <IoPrint className="inline mr-2" />បោះពុម្ព
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

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
                        <div className="max-w-sm modal_center">
                            <div className="modal_title">
                                <h3 className="">លុបទំនិញ</h3>

                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-md ">
                                    តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
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
                                        onClick={deleteproduct}
                                    >
                                        លុប
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* update  Modal Status */}
            <AnimatePresence>
                {IsModalUpdateStatus && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative w-full max-w-lg mt-20 bg-white shadow dark:bg-gray-700">
                            <div className="modal_title">
                                <h3 className="">កែប្រែផលិតផលមកដល់ស្តុក</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsModalUpdateStatus(false)} />
                            </div>
                            <div className="modal_form">
                                <form class="py-6" onSubmit={UpdateProduct}>
                                    <div class="grid gap-4 mb-4 grid-cols-1">
                                        <div className="col-span-1 space-y-2">
                                            <label htmlFor="" className="font-bold font-NotoSansKhmer">ស្ថានភាព: *</label>
                                            <select
                                                required
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="input_text font-NotoSansKhmer"
                                            >
                                                <option value="inactive">បិទការលក់</option>
                                                <option value="active">កំពុងលក់</option>
                                            </select>
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
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='flex py-2 space-x-8'>
                <p className='text-red-500'>ឈ្មោះផលិតផល « ក្រហម » ថ្ងៃផុតកំណត់</p>
                <p className='text-blue-500'>ឈ្មោះផលិតផល « ខៀវ » នៅសល់៧ថ្ងៃផុតកំណត់</p>
                <p className='text-green-500'>ឈ្មោះផលិតផល « បៃតង » នៅសល់15ថ្ងៃផុតកំណត់</p>
            </div>
        </div>
    );
};
export default Dashboard;