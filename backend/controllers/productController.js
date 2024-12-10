import { v2 as cloudinary } from "cloudinary";

// Function for add product 
const addProduct = async (req,res) => {
    try {
        
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        console.log(name, description, price, category, subCategory, sizes, bestseller);
        console.log(image1,image2,image3,image4);
        console.log(imagesUrl);
        console.log('req.files:', req.files);
console.log('req.body:', req.body);



        res.json({}) 
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }

}

// Function for list product
const listProducts = async (req,res)=>{

}

//Function for Remove Product
const removeProduct = async (req,res)=>{

}

//Function for Single Product Info 
const singleProduct = async (req,res)=>{
    
}

export {listProducts,addProduct,removeProduct,singleProduct};