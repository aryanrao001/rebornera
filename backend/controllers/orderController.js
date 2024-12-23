import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Placing Orders using COD Method 
const placeOrder = async (req, res) => {
    const session = await productModel.startSession();
    session.startTransaction();

    try {
        const { userId, items, amount, address } = req.body;

        // Loop through each item in the order
        for (const item of items) {
            const product = await productModel.findById(item._id).session(session);
            if (!product) {
                throw new Error(`Sorry, Product not found`);
            }

            // Find the size for this product and check the stock
            const size = product.sizes.find(size => size.size === item.size);
            if (!size) {
                throw new Error(`Size ${item.size} not found for product ${product.name}`);
            }

            console.log(`Checking stock for ${product.name} (size: ${item.size}) - Available: ${size.quantity}, Requested: ${item.quantity}`);

            // Check if the requested quantity is available
            if (size.quantity < item.quantity) {
                throw new Error(`Sorry, but there is no stock for ${product.name} (${item.size}). Available: ${size.quantity}, Requested: ${item.quantity}`);
            }

            // Deduct stock for the size
            size.quantity -= item.quantity;
            console.log(`Updated stock for ${product.name} (size: ${item.size}) - New quantity: ${size.quantity}`);

            // Update the product document with the updated size quantity
            await productModel.updateOne(
                { _id: product._id, 'sizes.size': item.size }, 
                {
                    $set: { 'sizes.$.quantity': size.quantity } 
                },
                { session }
            );

            // Update the total stock of the product (sum of all sizes' quantities)
            const totalStock = product.sizes.reduce((total, size) => total + size.quantity, 0);

            // Update the total stock for the product in the database
            await productModel.updateOne(
                { _id: product._id },
                { $set: { stock: totalStock } },
                { session }
            );
        }

        // Create the order data
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        // Save the order to the database
        const newOrder = new orderModel(orderData);
        await newOrder.save({ session });

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

        // Commit the transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        console.log('Order placed successfully and stock updated!');
        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        // If any error occurs, rollback the transaction
        await session.abortTransaction();
        session.endSession();

        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

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