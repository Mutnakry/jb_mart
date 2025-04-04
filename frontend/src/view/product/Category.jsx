import React from 'react'
import Navbar from '../../component/Navbar'
import CategoryConponent from '../../component/product/Category'

function Category() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
            <div className=' Div_bar'>
                  <CategoryConponent />
                </div>
            </div>
        </div>
    )
}

export default Category

