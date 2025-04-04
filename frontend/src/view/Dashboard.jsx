import React from 'react';
import Navbar from '../component/Navbar';
import ChartPruchaeseDetail from './Dashbord/ChartPruchaeseDetail'
import ProductPurchase from './Dashbord/ProductPurchase'
import ChartPruchaeseDetail_InMonth from './Dashbord/ChartPruchaeseDetail_InMonth'
import SaleproductInDayDolla from './Dashbord/SaleproductInDay'
import CountItems from './Dashbord/CountItems';
import SaleProductExchang from './Dashbord/SaleProductExchang'
import SaleProductSumDay from './Dashbord/SaleProductSumDay';
import CountProduct_QTY_Sale from './Dashbord/CountProductSale'
import SumOrderAll from './Dashbord/SumOrderAll'
import Check_StockIN_StockOUT_Product from './Dashbord/Check_StockIN_StockOUT_Product'
import Check_NoteQTYProdut from './Dashbord/Check_NoteQTYProdut'  ///  check MG_stock qty <= not-qty 
import ProductPubblar from './Dashbord/ProductPubblar'
import ReportOpensale from './Dashbord/ReportOpenSale';
import Customer from '../component/invoie/Customer';
import IncomeSale from './Dashbord/IncomeSale'
import Expent from './Dashbord/Expent'
import Profit from './Dashbord/Profit'
import IncomeExpentProfit from './Dashbord/IncomeExpentProfit'

const Dashboard = () => {
  return (
    <div className=''>
      <Navbar />
      <div className='h-auto overflow-hidden bg-gray-100 md:pt-16 sm:ml-64 dark:bg-gray-950'>
        <div className='p-6 m-2 md:m-4 border-slate-200 md:p-0'>
          <div>
            < CountItems />
          </div>
          <div className=''>
            <div className='grid grid-cols-1 p-6 mb-3 bg-white border-t-2 border-blue-600 shadow-sm xl:grid-cols-2'>
              <div className='flex items-center justify-center md:border-r-2'>

                <ChartPruchaeseDetail />
              </div>
              <div className='flex items-center justify-center '>
                <ProductPurchase />
              </div>
            </div>
            <div className='flex items-center col-span-1 p-6 my-4 bg-white border-t-2 border-green-600 shadow-sm'>
              {/* <ChartPruchaeseDetail /> */}
              <CountProduct_QTY_Sale />
            </div>
            <div className='flex items-center col-span-1 p-6 mt-2 bg-white border-t-2 border-pink-600'>
              <ProductPubblar />
            </div>

            {/* check MG_stock qty <= not-qty */}
            <div className='flex items-center col-span-1 p-6 my-4 bg-white border-t-2 border-green-600 shadow-sm'>
              <Check_NoteQTYProdut />
            </div>
            <div className='grid xl:grid-cols-3  md:grid-cols-1 grid-cols-1 items-center  p-6 my-4 bg-white border-t-2 border-green-600 shadow-sm'>
              <div>
                <IncomeSale />
                <Expent />
                <Profit />
              </div>
              <div className='col-span-2'>
                <IncomeExpentProfit />
              </div>
            </div>
            <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-yellow-600'>
              <ChartPruchaeseDetail_InMonth />
            </div>
            <div className='grid xl:grid-cols-2  md:grid-cols-2 grid-cols-1 gap-6 my-4'>
              <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-yellow-600'>
                <SaleproductInDayDolla />

              </div>
              <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-green-600 shadow-sm'>
                <SaleProductSumDay />
              </div>
              {/* <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-pink-600'>
                <SaleProductExchang />
              </div> */}
            </div>

            <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-pink-600'>
              <SaleProductExchang />
            </div>

            <div className='flex items-center col-span-1 p-6 bg-white border-t-2 border-pink-600'>
              <SumOrderAll />
            </div>
            <div className='flex items-center col-span-1 p-6 mt-2 bg-white border-t-2 border-pink-600'>
              <Check_StockIN_StockOUT_Product />
            </div>

            <div className='flex items-center col-span-1 p-6 mt-2 bg-white border-t-2 border-pink-600'>
              <ReportOpensale />
            </div>

            <div className='flex items-center p-6 my-4 bg-white border-t-2 border-green-600 shadow-sm'>
              <Customer />
            </div>
          </div>
          <div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;

