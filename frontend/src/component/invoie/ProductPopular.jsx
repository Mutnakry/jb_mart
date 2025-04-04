
import React from 'react';
import Navbar from '../Navbar';
import ProductPubblar from '../../view/Dashbord/ProductPubblar'

function ProductPopular() {
    return (
        <div >
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] h-screen bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <ProductPubblar />
                </div>
            </div>
        </div>

    )
}

export default ProductPopular