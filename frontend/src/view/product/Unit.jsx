import React from 'react'
import Navbar from '../../component/Navbar'
import UnitConponent from '../../component/product/Ubit'

function Unit() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
            <div className=' Div_bar'>
                <UnitConponent />
            </div>
            </div>
        </div>
    )
}

export default Unit