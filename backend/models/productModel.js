import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: [
        {
            size: { type: String, required: true }, // e.g., "S", "M", "L", "XL"
            quantity: { type: Number, required: true } // Quantity of this size
        }
    ],
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
