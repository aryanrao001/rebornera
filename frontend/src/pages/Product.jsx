import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets/frontend_assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Render stock messages based on quantity
  const renderStockMessage = () => {
    if (!productData) return null;

    const selectedSize = productData.sizes.find((item) => item.size === size);
    if (!selectedSize) return null;

    const stock = selectedSize.quantity;

    if (stock === 0) {
      return <p className="text-red-600">Sorry, this size is out of stock.</p>;
    } else if (stock === 1) {
      return <p className="text-orange-500">Hurry! Only 1 left in stock for this size!</p>;
    } else if (stock <= 5) {
      return <p className="text-emerald-500">Hurry! Only a few left in stock for this size!</p>;
    } else {
      return null; // No message for ample stock
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-xl mt-1">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-5" />
            <img src={assets.star_icon} alt="" className="w-5" />
            <img src={assets.star_icon} alt="" className="w-5" />
            <img src={assets.star_icon} alt="" className="w-5" />
            <img src={assets.star_dull_icon} alt="" className="w-5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-4">
            <p>Select Size </p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item.size)}
                  className={`border py-2 px-4 bg-gray-100 ${item.size === size ? 'border-orange-400 ' : ''}`}
                  key={index}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional rendering for Add to Cart and Stock Message */}
          {size && (
            <>
              {renderStockMessage()}
              {productData.sizes.find((item) => item.size === size)?.quantity > 0 && (
                <button
                  onClick={() => addToCart(productData._id, size)}
                  className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
                >
                  ADD TO CART
                </button>
              )}
            </>
          )}
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-3 flex flex-col gap-1">
            <p>100% Original Products</p>
            <p>Cash on Delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* --------------------- Description & Review Section --------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm"> Description </b>
          <p className="border px-5 py-3 text-sm"> Reviews (122) </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga quo explicabo, blanditiis aliquid
            placeat incidunt fugiat omnis! Nihil, et eligendi optio ipsum fugiat odio accusamus necessitatibus
            sequi! Dolorum, vitae atque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus alias
            mollitia quis accusamus perferendis ipsum quidem aspernatur rem ex ad? Possimus officiis magnam
            ipsam repudiandae sapiente. Id esse doloremque distinctio!
          </p>
        </div>
      </div>

      {/* --------------- Display Related Products ------------- */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
