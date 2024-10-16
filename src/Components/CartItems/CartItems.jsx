import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';

const ProductList = () => {
  const { all_product, addToCart } = useContext(ShopContext);

  return (
    <div>
      {all_product.map((product) => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} />
          <p>{product.name}</p>
          <p>${product.new_price}</p>
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
