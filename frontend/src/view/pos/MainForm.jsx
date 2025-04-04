import React from 'react';
import Cart from '../../component/pos/Cart';
import ViewProduct from '../../component/pos/ViewProduct';
import Navbar from './Navbar';

function MainForm() {
    return (
        <div>
            <div className='bg-white'>
                <Navbar />
                <div className='grid md:grid-cols-2 mt-10 m-2'>
                    <div className='h-screen'>
                        <Cart />
                    </div>
                    <div>
                        <ViewProduct />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainForm;
