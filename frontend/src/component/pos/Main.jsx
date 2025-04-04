// import React from 'react';

// const PosPage = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <header className="bg-gray-200 p-4 flex items-center justify-between">
//         <h1 className="text-xl font-bold">MasterPOS</h1>
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <select className="p-2 border rounded">
//               <option>Walk-In Customer</option>
//               {/* Add more options here */}
//             </select>
//           </div>
//           <button className="bg-blue-500 text-white p-2 rounded">Add</button>
//         </div>
//       </header>

//       {/* Search and Table Section */}
//       <div className="p-4">
//         <div className="flex items-center space-x-4 mb-4">
//           <input
//             type="text"
//             placeholder="Search for a product/sku"
//             className="w-full p-2 border rounded"
//           />
//           <button className="bg-green-500 text-white p-2 rounded">Search</button>
//         </div>

//         {/* Products Table */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-2">Product</th>
//                 <th className="p-2">Price</th>
//                 <th className="p-2">Quantity</th>
//                 <th className="p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Render table rows dynamically */}
//               <tr>
//                 <td className="p-2">Product Name</td>
//                 <td className="p-2">$0.00</td>
//                 <td className="p-2">0</td>
//                 <td className="p-2">
//                   <button className="bg-red-500 text-white p-2 rounded">Remove</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-5 gap-4 p-4">
//         {/* Render product cards dynamically */}
//         <div className="bg-white shadow p-4 text-center rounded-lg">
//           <img src="image_url" alt="Product" className="w-full h-24 object-cover" />
//           <h2 className="mt-2">Product Name</h2>
//           <p className="text-sm text-gray-600">SKU: 1234</p>
//         </div>
//         {/* Repeat for other products */}
//       </div>

//       {/* Footer Section */}
//       <footer className="bg-gray-200 p-4 flex justify-between">
//         <div>Total: $0.00</div>
//         <div className="flex space-x-4">
//           <button className="bg-green-500 text-white p-2 rounded">Pay</button>
//           <button className="bg-red-500 text-white p-2 rounded">Cancel</button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PosPage;


import React from 'react';

const PointOfSale = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Section */}
      <div className="flex justify-between mb-4">
        {/* Left Dropdown */}
        <div className="flex items-center space-x-2">
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option>Walk-In Customer</option>
            {/* Add more customer types here */}
          </select>
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
            +
          </button>
        </div>

        {/* Search Box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 w-80"
            placeholder="បញ្ចូលឈ្មោះផលិតផល / SKU / សំនួរពាក់ព័ន្ធ"
          />
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16 10.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-center">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">កូដផលិតផល</th>
              <th className="py-3 px-6">បរិមាណ</th>
              <th className="py-3 px-6">តម្លៃ</th>
              <th className="py-3 px-6">អនុគ្រ</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {/* Add rows dynamically */}
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">0247</td>
              <td className="py-3 px-6">1</td>
              <td className="py-3 px-6">$10.00</td>
              <td className="py-3 px-6">10%</td>
              <td className="py-3 px-6">
                <button className="text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm bg-gray-200 p-4 rounded-lg">
        <div>
          <p>សរុប:</p>
          <p>$0.00</p>
        </div>
        <div>
          <p>ការបញ្ចុះតំលៃ:</p>
          <p>$0.00</p>
        </div>
        <div>
          <p>ចំណាយបន្ថែម:</p>
          <p>$0.00</p>
        </div>
        <div>
          <p>សរុបចុងក្រោយ:</p>
          <p>$0.00</p>
        </div>
      </div>
    </div>
  );
};

export default PointOfSale;
