import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {API_URL} from '../../service/api'


const PurchaseDetails = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
  const [product_ID, setProduct_ID] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const today = new Date().toISOString().split('T')[0];


  const [amountDiscount, setAmountDiscount] = useState(0);
  const [amountTotal, setAmountTotal] = useState(0);
  const [amounPayDate, setAmountPayDate] = useState(0);
  const [createDob, setCreateDob] = useState(today);
  const [status, setStatus] = useState('completed');
  const [supplier_id, setSupplier_ID] = useState('');
  const [paymentType_ID, setPaymentType_ID] = useState(null);
  const [account_ID, setAccount_ID] = useState(null);



  useEffect(() => {
    axios
      .get(`${API_URL}/api/purchase/puchase/${id}`)
      .then((response) => {
        setPurchaseData(response.data);
        console.log("Purchase Data:", response.data);
        setEditableData(response.data);
        setAmountDiscount(response.data[0]?.amount_discount || 0);
        setAmountTotal(response.data[0]?.amount_pay || 0);
        setAmountPayDate(response.data[0]?.pay_date || 0);
        setCreateDob(response.data[0]?.date_by || today);
        setStatus(response.data[0]?.status);
        setSupplier_ID(response.data[0]?.supplier_id);
        setPaymentType_ID(response.data[0]?.paymenttype_id);
        setAccount_ID(response.data[0]?.account_id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);


  ///// product
  const [editableData, setEditableData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/product`)
      .then((response) => {
        setProducts(response.data.product);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  useEffect(() => {
    fetchsupplier();
    getPaymentType();
    getAccountBank();
  }, [])

  ///// supplier
  const [supplier, setsupplier] = useState([]);
  const fetchsupplier = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/supplier`);
      setsupplier(response.data.supplier);
      setError('');
    } catch (error) {
      setError('Error fetching supplier data');
    } finally {
      setLoading(false);
    }
  };

  ///// get payment Type
  const [paymentType, setPaymentType] = useState([]);
  const getPaymentType = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment_type`);
      setPaymentType(response.data.payment_type);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };

  ///// get account
  const [accountBank, setAccountBank] = useState([]);
  const getAccountBank = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/account`);
      setAccountBank(response.data.account);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };


  const filteredOptionsProduct = products.filter((product) =>
    product.pro_names.toLowerCase().includes(product_ID.toLowerCase())
  );

  const handleInputChange = (index, field, value) => {
    const updatedData = [...editableData];
    updatedData[index][field] = value;
    setEditableData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/api/purchase/purchase/${id}`, editableData)
      .then((response) => {
        toast.success("Purchase details updated successfully!");
        setPurchaseData(editableData);
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        toast.error("Failed to update purchase details.");
      });
  };



  const handleRemoveProduct = (productId) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedSelectedProducts);
    const updatedEditableData = editableData.filter(
      (item) => item.id !== productId
    );
    setEditableData(updatedEditableData);
    toast.success("Product removed successfully!", {
      position: "top-center",
      autoClose: 1000,
    });
  };




  const handleAddProduct = (product) => {

    const isProductInPurchaseData = purchaseData.some(
      (item) => item.product_id === product.id
    );
    if (isProductInPurchaseData) {
      toast.error(`ផលិតផល ${product.pro_names} មិនអាចបន្ថែមបានទេ ព្រោះវាត្រូវនឹងការទិញដើម!`, {
        position: "top-center",
        autoClose: 2000,
      });
    } else if (selectedProducts.find((p) => p.id === product.id)) {
      toast.error(`ផលិតផល ${product.pro_names} មានរូចហើយ!`, {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      // Add the product to selectedProducts
      setSelectedProducts([...selectedProducts, product]);

      const newProductData = {
        ...product,
        qty: 1,
        discount: 0,
        cost_price: product.cost_price || 0,
        include_tax: product.include_tax || 0,
        exclude_tax: product.exclude_tax || 0,
        total: 0,
      };


      console.log("purchaseData.id:", purchaseData[0]?.product_id);
      console.log("selectedProducts:", selectedProducts);
      console.log("product.id:", product.id);
      setEditableData([...editableData, newProductData]);
    }

    // Clear the search input and close the dropdown
    setProduct_ID("");
    setIsDropdownOpenProduct(false);
  };


  const handleProductSearchChange = (e) => {
    setProduct_ID(e.target.value);
    setIsDropdownOpenProduct(e.target.value.length > 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  const handleAmountDiscountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      setAmountDiscount(0);
    } else {
      setAmountDiscount(value);
    }
  };



  const handleAmountTotalChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      setAmountTotal(0);
    } else {
      setAmountTotal(value);
    }
  };
  const handleAmountPayDatelChange = (e) => {
    setAmountPayDate(e.target.value);
  };


  return (
    <div>
      <h1>Purchase Details</h1>
      {purchaseData.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <h2>Customer ID: {purchaseData[0].customerId}</h2>
          <h3>Payment Information:</h3>
          <p>Payment Type ID: {purchaseData[0].paymenttype_id}</p>
          <p>Account ID: {purchaseData[0].account_id}</p>
          <p>Total Amount: {purchaseData[0].amount_total}</p>
          <p>Amount Discount: {purchaseData[0].amount_discount}</p>
          <p>Amount Paid: {purchaseData[0].amount_pay}</p>
          <p>Payment Date: {purchaseData[0].pay_date}</p>
          <p>Payment Date: {purchaseData[0].date_by}</p>
          <p>Payment Date: {purchaseData[0].status}</p>
          <p>Payment Date: {purchaseData[0].id}</p>



          <div className='py-8 px-4 shadow-md  border-t-4 border-blue-600 rounded-md'>
            <div className='grid grid-cols-3 gap-4'>
              <div className="space-y-2">
                <label htmlFor="groupCustomer" className="font-NotoSansKhmer">វិធីសាស្សបង់ប្រាក់:</label>
                <select
                  className='input_text'
                  id="bank"
                  value={supplier_id}
                  required
                  onChange={e => setSupplier_ID(e.target.value)}
                >
                  <option value="" >សូមជ្រើសរើស</option>
                  {supplier?.map((items) => (
                    <option key={items.id} value={items.id}>
                      {items.full_names} {items.business_names}

                    </option>
                  ))}

                </select>
              </div>

              {/* Date Input */}
              <div className="col-span-1 space-y-2">
                <label className="font-NotoSansKhmer font-bold">កាលបរិច្ឆេទទិញ: *</label>
                <input
                  type="date"
                  id="price"
                  min={today}
                  value={createDob}
                  onChange={(e) => setCreateDob(e.target.value)}
                  className="input_text"
                  required
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label htmlFor="" className="font-bold font-NotoSansKhmer">ស្ថានភាព: *</label>
                <select
                  required
                  value={status}
                  onChange={(e) => {
                    const selectedStatus = e.target.value;
                    setStatus(selectedStatus);
                    console.log(selectedStatus);
                  }}
                  className="input_text font-NotoSansKhmer"
                >
                  <option value="" disabled>--ជ្រើសរើស--</option>
                  <option value="completed">បានទទួល</option>
                  <option value="active">រងចាំ</option>
                  <option value="pending">បានបញ្ជាទិញ</option>
                </select>
              </div>
            </div>

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
                    <div className="absolute right-[15%] top-3.5">
                      {/* Search icon */}
                    </div>
                  </div>
                  <div className="absolute top-0 right-[-3%]">
                    <button
                      type="button"
                      className="py-2.5 button_only_submit"
                      onClick={() => setIsDropdownOpenProduct((prev) => !prev)}
                    >
                      + ជ្រើសរើសផលិតផល
                    </button>
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
                            {product.pro_names} {product.id}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500 font-NotoSansKhmer">
                          មិនមានកាត ឈ្មោះនេះ​{" "}
                          <span className="font-bold">{product_ID}</span> ទេ!
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>

          <table>
            <div className='pb-12 pt-6 px-4 shadow-md mt-8  border-t-4 border-pink-600 rounded-md'>
              <h3 className="text-lg font-semibold">កំណត់ការបញ្ជាទិញ</h3>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Cost Price តម្លៃដើម(ឯកតា)</th>
                  <th>Included Tax មិនរាប់បញ្ចូលពន្ធ Null</th>
                  <th>Excluded Tax  	តម្លៃដើមលក់ចេញ(ឯកតា)</th>
                  <th>total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {editableData.map((item, index) => {
                  const qty = Number(item.qty) || 0;
                  const excludeTax = Number(item.exclude_tax) || 0;
                  const discount = Number(item.discount) || 0;
                  const includeTax = Number(item.include_tax) || 0;
                  const totalPrice = (qty * excludeTax) - (discount - includeTax);

                  return (
                    <tr key={`${item.id}-${index}`}>
                      <td className="p-2">
                        {item.pro_names}
                        <p className="text-xs text-gray-500">
                          មានស្តុកនៅសល់ {item.stock} {item.unit_names}

                        </p>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.qty}
                          className="bg-gray-100 input_text"
                          onChange={(e) => handleInputChange(index, "qty", e.target.value)}
                        />
                        <span className='text-xs'> {item.unit_names}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.discount}
                          className="bg-gray-100 input_text"
                          onChange={(e) => handleInputChange(index, "discount", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.cost_price}
                          className="bg-gray-100 input_text"
                          onChange={(e) => handleInputChange(index, "cost_price", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.include_tax}
                          className="bg-gray-100 input_text"
                          onChange={(e) => handleInputChange(index, "include_tax", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.exclude_tax}
                          className="bg-gray-100 input_text"
                          onChange={(e) => handleInputChange(index, "exclude_tax", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          readOnly
                          value={totalPrice}
                          className="bg-gray-100 input_text"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="p-2 text-white bg-red-500 hover:bg-red-400"
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          Remove1
                        </button>
                      </td>
                    </tr>

                  );
                })}
              </tbody>
            </div>


            <div className="pb-12 pt-6 px-4 shadow-md mt-8  border-t-4 border-green-600 rounded-md">
              <h3 className="text-lg font-semibold">បន្ថែមការទូទាត់</h3>
              <hr className="my-2" />
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label htmlFor="">ចំនួនការទូទាត់សរុប($)</label>
                  <input
                    type="number"
                    readOnly

                    value={editableData.reduce((sum, item) => {
                      const qty = Number(item.qty) || 0;
                      const excludeTax = Number(item.exclude_tax) || 0;
                      const discount = Number(item.discount) || 0;
                      const includeTax = Number(item.include_tax) || 0;
                      const totalPrice = (qty * excludeTax) - (discount - includeTax);
                      return sum + totalPrice;
                    }, 0)}
                    className="bg-gray-100 input_text font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="">ចំនួនទឹកប្រាក់បញ្ចុះតម្លៃ</label>
                  <input
                    type="number"
                    value={amountDiscount}
                    onChange={handleAmountDiscountChange} // Add the onChange handler
                    required
                    step={0.01}
                    min={0}
                    placeholder="0.00"
                    className="input_text"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="">ទូទាត់សាច់ប្រាក់($): * </label>
                  <input
                    type="number"
                    value={amountTotal}
                    onChange={handleAmountTotalChange}
                    required
                    step={0.01}
                    min={0}
                    placeholder="0.00"
                    className="input_text"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="">កាលបរិច្ឆេតបង់ប្រាក់ : *</label>
                  <input type="date"
                    required
                    placeholder="0.0"
                    value={amounPayDate}
                    onChange={handleAmountPayDatelChange}
                    min={today}
                    className="input_text"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="">វិធីសាទូទាត់</label>
                  <select
                    className='input_text'
                    id="bank"
                    value={paymentType_ID}
                    onChange={e => setPaymentType_ID(e.target.value)}
                  >
                    <option value="" >សូមជ្រើសរើស</option>
                    {paymentType?.map((items) => (
                      <option key={items.id} value={items.id}>
                        {items.pay_manes}
                      </option>
                    ))}

                  </select>

                </div>
                <div className="space-y-2">
                  <label htmlFor="groupCustomer" className="font-NotoSansKhmer">វិធីសាស្សបង់ប្រាក់:</label>
                  <select
                    className='input_text'
                    id="bank"
                    value={account_ID}
                    onChange={e => setAccount_ID(e.target.value)}
                  >
                    <option value="" >សូមជ្រើសរើស</option>
                    {accountBank?.map((items) => (
                      <option key={items.id} value={items.id}>
                        {items.acc_names}
                      </option>
                    ))}

                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="">ចំនួននៅសល់($)</label>
                  <input
                    type="number"
                    value={
                      editableData.reduce((sum, item) => {
                        const qty = Number(item.qty) || 0;
                        const excludeTax = Number(item.exclude_tax) || 0;
                        const discount = Number(item.discount) || 0;
                        const includeTax = Number(item.include_tax) || 0;
                        const totalPrice = qty * excludeTax - (discount - includeTax);
                        return sum + totalPrice;
                      }, 0) -
                      amountDiscount -
                      amountTotal
                    }
                    readOnly
                    className="bg-gray-100 input_text"
                  />
                </div>

              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white font-NotoSansKhmer bg-blue-500 hover:bg-blue-600"
              >
                រក្សាទុក
              </button>
            </div>
          </table>


        </form>
      ) : (
        <div>No purchase data found.</div>
      )}
    </div>
  );
};

export default PurchaseDetails;


