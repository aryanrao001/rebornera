import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Placing Orders using COD Method 
const placeOrder = async (req,res) =>{
    const session = await productModel.startSession();
    session.startTransaction();
    try {
        const {userId,items,amount,address} = req.body;

        for (const item of items) {
            const product = await productModel.findById(item._id).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item._id} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }

            // Deduct stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

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

        await session.commitTransaction();
        session.endSession();


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
    try {
        const orders = await orderModel.find({});
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message});   
    }
}

// User Order Data for Frotnend 
const userOrders = async(req,res) =>{
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message});
    }
}

// Update order status from Admin Panel
const updateStatus = async (req,res)=>{
    try {
        const {orderId , status } = req.body 
        await orderModel.findByIdAndUpdate(orderId,{ status });
        res.json({success:true,message:'Status Updated'});
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {placeOrder , placeOrderstripe , placeOrderRazorpay ,allOrders, userOrders , updateStatus}