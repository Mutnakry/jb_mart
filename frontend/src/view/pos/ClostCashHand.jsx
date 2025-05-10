

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from '../../service/api';
// import { motion } from 'framer-motion';



// const ClostCashHand = ({ setIsOpenCash }) => {
//     const Navigator = useNavigate(); // Correctly use useNavigate
//     const [userLoginNames, setUserLoginNames] = useState('');
//     const [shift, setShift] = useState('Morning'); // Corrected state name from setshift to setShift
//     const [opening_balance, setOpeningBalance] = useState(''); // Corrected state name from setopening_balance to setOpeningBalance
//     const [currentShift, setCurrentShift] = useState(null);
//     const [getID, setGetID] = useState(null);

//     useEffect(() => {
//         fetchCurrentShift();
//         const storedUserId = localStorage.getItem('user_id') || '';
//         setUserLoginNames(storedUserId);
//     }, []);

//     // const startShift = async (e) => {
//     //     e.preventDefault();
//     //     const shiftData = {
//     //         shift: shift,
//     //         opening_balance: opening_balance,
//     //         cashier_id: userLoginNames,
//     //     };
//     //     console.log("Shift Data to be sent:", shiftData);

//     //     try {
//     //         const response = await axios.post(`${API_URL}/api/opencash`, shiftData);
//     //         toast.success("Shift started successfully!");
//     //         setCurrentShift(response.data);
//     //         setGetID(response.data.id);
//     //         Navigator('/index/pos');
//     //     } catch (error) {
//     //         toast.error("Failed to start shift");
//     //         console.error("Error details:", error.response ? error.response.data : error.message);
//     //     }
//     // };

//     const fetchCurrentShift = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/api/opencash/active`);
//             console.log(response.data);

//             // Adjust based on response structure
//             if (response.data && response.data.shift && response.data.opening_balance) {
//                 setCurrentShift(response.data);
//                 setGetID(response.data.id);
//                 Navigator('/index/pos');
//             } else {
//                 setCurrentShift(null);
//                 setGetID(null);
//                 Navigator('/check/pos');
//             }
//         } catch (error) {
//             console.error("Error fetching shift:", error);
//             setCurrentShift(null);
//             setGetID(null);
//         }
//     };




//     const closeShift = async () => {
//         if (!currentShift) return toast.error("No active shift to close");

//         try {
//             await axios.put(`${API_URL}/api/opencash/close/${currentShift.id}`);
//             toast.success("Shift closed successfully!");
//             setCurrentShift(null);
//         } catch (error) {
//             toast.error("Failed to close shift");
//             console.error(error);
//         }
//     };


//     const handleOverlayClick = (e) => {
//         if (e.target === e.currentTarget) {
//             setIsOpenCash(false);
//         }
//     };
//     return (
//         <motion.div
//             className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.2 }}
//             onClick={handleOverlayClick}
//         >
//             <div className="relative w-full max-w-3xl m-4 bg-white rounded shadow-md mt-10 p-2 py-4 dark:bg-gray-700">
//                 <div className="">
//                     <h2 className="text-xl font-bold mb-4">Active Shift</h2>

//                     {!currentShift ? (
//                         <form className="space-y-3">
//                             <label className="block">
//                                 Shift Type:
//                                 <select
//                                     className="block w-full p-2 border rounded"
//                                     value={shift}
//                                     onChange={(e) => setShift(e.target.value)} // Corrected state setting
//                                 >
//                                     <option value="Morning">Morning</option>
//                                     <option value="Afternoon">Afternoon</option>
//                                     <option value="Night">Night</option>
//                                 </select>
//                             </label>

//                             <label className="block">
//                                 Opening Balance ($):
//                                 {getID && (
//                                     <div className="p-2 mb-2 text-red-700 bg-red-200 rounded">
//                                         ⚠️ A shift is already active. Close the current shift before entering an opening balance.
//                                     </div>
//                                 )}
//                                 <input
//                                     type="number"
//                                     className="block w-full p-2 border rounded"
//                                     value={opening_balance}
//                                     onChange={(e) => setOpeningBalance(e.target.value)} // Corrected state setting
//                                     required
//                                     disabled={!!getID} // Disables input if shift is active
//                                 />
//                             </label>

//                             <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//                                 Start Shift
//                             </button>
//                             {getID && (
//                                 <div className="p-3 mb-4 text-red-700 bg-red-200 rounded">
//                                     ⚠️ A shift is already active. Close the current shift before starting a new one.
//                                 </div>
//                             )}
//                         </form>
//                     ) : (
//                         <div>
//                             <p><strong>Shift:</strong> {currentShift.shift}</p>
//                             <p><strong>Opening Balance:</strong> ${currentShift.opening_balance}</p>
//                             <button onClick={closeShift} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4">
//                                 Close Shift
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </motion.div>
//     );
// };
// export default ClostCashHand



import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../service/api';
import { motion } from 'framer-motion';
import ModaleCost from "../../component/const/modale/Cost";

const ClostCashHand = ({ setIsOpenCash }) => {
    const Navigator = useNavigate();
    const [userLoginNames, setUserLoginNames] = useState('');
    const [currentShift, setCurrentShift] = useState(null);
    const [getID, setGetID] = useState(null);
    useEffect(() => {
        fetchCurrentShift();
        const storedUserId = localStorage.getItem('user_id') || '';
        setUserLoginNames(storedUserId);
    }, []);

    const fetchCurrentShift = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/opencash/active`);
            console.log(response.data);
            // Adjust based on response structure
            if (response.data && response.data.shift && response.data.opening_balance) {
                setCurrentShift(response.data);
                setGetID(response.data.id);
                Navigator('/index/pos');
            } else {
                setCurrentShift(null);
                setGetID(null);
                Navigator('/check/pos');
            }
        } catch (error) {
            console.error("Error fetching shift:", error);
            setCurrentShift(null);
            setGetID(null);
        }
    };

    const closeShift = async () => {
        if (!currentShift) return toast.error("No active shift to close");

        try {
            await axios.put(`${API_URL}/api/opencash/close/${currentShift.id}`);
            toast.success("បិទការលក់បានដោយជោគជ័យ!");
            setCurrentShift(null);
            // Navigator('/Dashboard')
            Navigator('/ReportClostCash')

        } catch (error) {
            toast.error("Failed to close shift");
            console.error(error);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpenCash(false);
        }
    };

    return (
        // <motion.div
        //     className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full bg-black bg-opacity-30"
        //     initial={{ opacity: 0, scale: 0.8 }}
        //     animate={{ opacity: 1, scale: 1 }}
        //     exit={{ opacity: 0, scale: 0.8 }}
        //     transition={{ duration: 0.2 }}
        //     onClick={handleOverlayClick}
        // >
        //     <div>
        //         <div className="w-full max-w-2xl mx-2 bg-white rounded shadow-md p-2 my-6 dark:bg-gray-700">
        //             <div className="">
        //                 <h2 className="text-xl font-bold text-green-500 mb-4">កំពុងបើលការលក់</h2>

        //                 {currentShift ? (
        //                     <div className="text-gray-500">
        //                         <p><strong>ការបើកពេល​ :</strong> {currentShift.shift}</p>
        //                         <p><strong>ការបើកសមតុល្យ : </strong>  ${currentShift.opening_balance}</p>
        //                         <button onClick={closeShift} className="w-full bg-red-500 text-white py-2 hover:bg-red-600 mt-4">
        //                             បិទការលក់
        //                         </button>
        //                     </div>
        //                 ) : (
        //                     <p className="text-gray-600">មិនមានទឹកប្រាក់បានបើក</p>
        //                 )}
        //                 <div className="h-[500px] overflow-hidden overflow-y-auto">
        //                     <ModaleCost />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </motion.div>

        <motion.div
  className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-40 backdrop-blur-sm px-4 py-10 overflow-auto hidden-scrollbar"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.25 }}
  onClick={handleOverlayClick}
>
  <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-KhmerMoul text-green-600 text-center">កំពុងបើកការលក់</h2>
      </div>

      {/* Shift Info */}
      {currentShift ? (
        <div className="space-y-4 text-gray-700 dark:text-gray-200">
          <p className="text-lg"><strong>🕒 ការបើកពេល៖</strong> {currentShift.shift}</p>
          <p className="text-lg"><strong>💵 សមតុល្យចាប់ផ្តើម៖</strong> ${currentShift.opening_balance}</p>

          <button
            onClick={closeShift}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold text-lg shadow"
          >
            បិទការលក់
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">🙁 មិនមានការបើកទេ</p>
      )}

      {/* ModaleCost Scrollable Section */}
      <div className="h-[400px] overflow-y-auto rounded-md border-t pt-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600">
        <ModaleCost />
      </div>
    </div>
  </div>
</motion.div>

    );
};
export default ClostCashHand