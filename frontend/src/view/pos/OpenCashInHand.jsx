// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from '../../service/api';
// import Navbar from "../../component/Navbar";

// const OpenCashInHand = () => {
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

//     const startShift = async (e) => {
//         e.preventDefault();
//         const shiftData = {
//             shift: shift,
//             opening_balance: opening_balance,
//             cashier_id: userLoginNames,
//         };
//         console.log("Shift Data to be sent:", shiftData);

//         try {
//             const response = await axios.post(`${API_URL}/api/opencash`, shiftData);
//             toast.success("Shift started successfully!");
//             setCurrentShift(response.data);
//             setGetID(response.data.id);
//             Navigator('/index/pos');
//         } catch (error) {
//             toast.error("Failed to start shift");
//             console.error("Error details:", error.response ? error.response.data : error.message);
//         }
//     };

//     // Fetch active shift
//     const fetchCurrentShift = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/api/opencash/active`);
//             console.log(response.data)
//             if (response.data) {
//                 setCurrentShift(response.data);
//                 setGetID(response.data.id);
//                 console.log(response.data)
//                 Navigator('/index/pos');
//             } else {
//                 setCurrentShift(null);
//                 setGetID(null);
//                 Navigator('/check/pos');
//             }

//             if (response.data === null) {
//                 alert("A shift is already active! Close the current shift first.");
//                 Navigator('/check/pos');
//                 return;
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
//             await axios.put(`${API_URL}/apo/opencash/close/${currentShift.id}`);
//             toast.success("Shift closed successfully!");
//             setCurrentShift(null);
//         } catch (error) {
//             toast.error("Failed to close shift");
//             console.error(error);
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className='py-12  px-6 sm:ml-64 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
//                 <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">

//                     <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">

//                         <h2 className="text-xl font-bold mb-4">{currentShift ? "Active Shift" : "Start Shift"}</h2>
//                         {!currentShift ? (
//                             <form onSubmit={startShift} className="space-y-3">
//                                 <label className="block">
//                                     Shift Type:
//                                     <select
//                                         className="block w-full p-2 border rounded"
//                                         value={shift}
//                                         onChange={(e) => setShift(e.target.value)} // Corrected state setting
//                                     >
//                                         <option value="Morning">Morning</option>
//                                         <option value="Afternoon">Afternoon</option>
//                                         <option value="Night">Night</option>
//                                     </select>
//                                 </label>

//                                 <label className="block">
//                                     Opening Balance ($):
//                                     {getID && (
//                                         <div className="p-2 mb-2 text-red-700 bg-red-200 rounded">
//                                             ⚠️ A shift is already active. Close the current shift before entering an opening balance.
//                                         </div>
//                                     )}
//                                     <input
//                                         type="number"
//                                         className="block w-full p-2 border rounded"
//                                         value={opening_balance}
//                                         onChange={(e) => setOpeningBalance(e.target.value)} // Corrected state setting
//                                         required
//                                         disabled={!!getID} // Disables input if shift is active
//                                     />
//                                 </label>

//                                 <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//                                     Start Shift
//                                 </button>

//                             </form>
//                         ) : (
//                             <div>
//                                 <p><strong>Shift:</strong> {currentShift.shift}</p>
//                                 <p><strong>Opening Balance:</strong> ${currentShift.opening_balance}</p>
//                                 <button onClick={closeShift} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4">
//                                     Close Shift
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OpenCashInHand;






import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../service/api';
import Navbar from "../../component/Navbar";

const OpenCashInHand = () => {
    const Navigator = useNavigate(); // Correctly use useNavigate
    const [userLoginNames, setUserLoginNames] = useState('');
    const [shift, setShift] = useState('Morning'); // Corrected state name from setshift to setShift
    const [opening_balance, setOpeningBalance] = useState(''); // Corrected state name from setopening_balance to setOpeningBalance
    const [currentShift, setCurrentShift] = useState(null);
    const [getID, setGetID] = useState(null);

    useEffect(() => {
        fetchCurrentShift();
        const storedUserId = localStorage.getItem('user_id') || '';
        setUserLoginNames(storedUserId);
    }, []);

    const startShift = async (e) => {
        e.preventDefault();

        if (opening_balance <= 0) {
            alert("បើកការលក់មិនអាចតូចជាងសូន្យ​នោះទេ");
            return;
        }

        const shiftData = {
            shift: shift,
            opening_balance: opening_balance,
            cashier_id: userLoginNames,
        };
        console.log("Shift Data to be sent:", shiftData);

        try {
            const response = await axios.post(`${API_URL}/api/opencash`, shiftData);
            toast.success("Shift started successfully!");
            setCurrentShift(response.data);
            setGetID(response.data.id);
            Navigator('/index/pos');
        } catch (error) {
            toast.error("Failed to start shift");
            console.error("Error details:", error.response ? error.response.data : error.message);
        }
    };

    // Fetch active shift
    const fetchCurrentShift = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/opencash/active`);
            console.log(response.data)
            if (response.data) {
                setCurrentShift(response.data);
                setGetID(response.data.id);
                console.log(response.data)
                Navigator('/index/pos');
            } else {
                setCurrentShift(null);
                setGetID(null);
                Navigator('/check/pos');
            }

            if (response.data === null) {
                alert("A shift is already active! Close the current shift first.");
                Navigator('/check/pos');
                return;
            }
        } catch (error) {
            console.error("Error fetching shift:", error);
            setCurrentShift(null);
            setGetID(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='py-12  px-4 sm:ml-64 w-auto h-screen items-center flex justify-center bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
                    <div className="p-4 max-w-lg mx-auto bg-white">
                        <h2 className="text-xl font-bold mb-4">ចាប់ផ្តើម បើលការលក់</h2>
                        <form onSubmit={startShift} className="space-y-3">


                            <div className="space-y-2">
                                <label className="block">
                                    ការបើកពេល​ :
                                </label>
                                <select
                                    className="block w-full p-2 border rounded"
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value)}
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block">
                                    ការបើកសមតុល្យ ($) :
                                </label>
                                <input
                                    type="number"
                                    className="input_text"
                                    value={opening_balance}
                                    onChange={(e) => setOpeningBalance(e.target.value)}
                                    required
                                    disabled={!!getID}
                                />
                            </div>
                            {getID && (
                                <div className="p-2 mb-2 text-red-700 bg-red-200 rounded">
                                    ⚠️ A shift is already active. Close the current shift before entering an opening balance.
                                </div>
                            )}
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600">
                                ចាប់ផ្តើមបើក
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenCashInHand;
