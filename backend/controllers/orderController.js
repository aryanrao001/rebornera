import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel";

// Placing Orders using COD Method 
const placeOrder = async (req,res) =>{
    try {
        const {userId,items,amount,address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Placing Orders using Stripe Method 
const placeOrderstripe = async (req,res) =>{

}

// Placing Orders using COD Method 
const placeOrderRazorpay = async (req,res) =>{

}

// All Orders data for Admin Panel
const allOrders = async(req,res) =>{

}

// User Order Data for Frotnend 
const userOrders = async(req,res) =>{
    
}

// Update order status from Admin Panel
const updateStatus = async (req,res)=>{

}

export default {placeOrder , placeOrderstripe , placeOrderRazorpay , allOrders , userOrders , updateStatus}