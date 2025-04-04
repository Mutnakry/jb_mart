import React from 'react'
import Navbar from '../../component/Navbar'
import BrandsConponent from '../../component/product/Brands'

function Brands() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
            <div className=' Div_bar'>
                    <BrandsConponent />
                </div>
            </div>
        </div>
    )
}

export default Brands

