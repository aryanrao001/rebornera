import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {


  const {backendUrl,token,currency} = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);

  const loadOrderData = async()=>{
    try {
      if(!token){
        return null
      }
      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}});
      if(response.data.success){
        let allOrdersItem = [];
        response.data.orders.map((order)=>(
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = orderpaymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        ))
        setorderData(allOrdersItem.reverse)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token])
  

  return (
    <div className='border-t pt-16' >

      <div className='text-2xl' >
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div >
        {
          orderData.slice(1,4).map((item,index)=>(
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4' >
              <div className='flex items-start gap-6 text-sm ' >
                <img src={item.image[0]} className='w-16 sm:w-20' alt="" />
                <div>
                  <p className='sm:text-base font-medium' >{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity : 1</p>
                    <p>Size : M</p>
                  </div>
                  <p className='mt-2' >Date <span className='text-gray-400'> 25, Jul , 2024 </span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between' >
                <div className='flex items-center gap-2' >
                  <p className='min-w-2 h-2 rounded-full bg-green-500' ></p>
                  <p className='text-sm md:text-base' >Ready to Ship</p>
                </div>
                <button className='border px-4 py-2 text-sm fotn-medium rouded-sm' >Track Order</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders