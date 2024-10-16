// CartItems.js
import React from 'react';

const CartItems = ({ all_product }) => {
  return (
    <div>
      {/* Ensure all_product exists before mapping */}
      {all_product && all_product.length > 0 ? (
        all_product.map((item, index) => (
          <div key={index}>
            <h2>{item[0]}</h2> {/* Product name */}
            <p>{item[1]}</p>   {/* Description */}
            <p>${item[2]}</p>  {/* Price */}
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default CartItems;
