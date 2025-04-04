import { useLocation, Link } from "react-router-dom";
import Navbar from "../component/Navbar";

function PageNotFound() {
    const location = useLocation();

    return (
        <div>
           <Navbar/>
       
        <div className="bg-gray-100 select-none min-h-screen flex flex-col justify-center items-center">
            <div className="w-[90%] md:w-[40%] lg:w-[30%] xl:w-[20%] bg-white shadow-sm p-10">
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25M12 15.25h.01M21.75 12c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25 21.75 6.615 21.75 12z" />
                    </svg>
                </div>
                <div className="flex justify-center">
                    <h1 className="font-NotoSansKhmer font-bold text-2xl text-center mb-2">រកមិនឃើញ</h1>
                </div>
                <p className="text-center font-NotoSansKhmer text-gray-600 mb-4 ">
                    ទំព័រ <span className="font-mono text-red-500 font-bold">{location.pathname}</span>  មិនមានទេ។
                </p>
                <div className="flex justify-center">
                    <Link to="/Dashboard" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 font-NotoSansKhmer">
                        ត្រលប់ដើម្បីចូលប្រើប្រាស់ 
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
}

export default PageNotFound;
