import React, { createContext, useState } from 'react';
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    const addToCart = (id) => {
        setCartItems((prevCartItems) => ({
            ...prevCartItems,
            [id]: (prevCartItems[id] || 0) + 1, // Increment the quantity
        }));
    };

    const removeFromCart = (id) => {
        setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            if (updatedCart[id] > 0) {
                updatedCart[id] -= 1; // Decrement the quantity
            }
            return updatedCart;
        });
    };

    const contextValue = { all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
