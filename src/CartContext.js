import React, {createContext, useState, useEffect} from 'react';
import { Alert } from 'react-native';

import { getProduct } from './services/ProductsService.js';

export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [visibleToast, setVisibleToast] = useState({visible: false, message: null, backgroundColor: null});
  
  function addItemToCart(produto, msg, bckClr) {
    // const product = getProduct(id);
    setVisibleToast({visible: true, message: msg, backgroundColor: bckClr});
    const product = produto;
    setItems((prevItems) => {
      const item = prevItems.find((item) => (item.id == product.id));
      if(!item) {
          return [...prevItems, {
              id: product.id,
              qty: 1,
              product,
              totalPrice: product.preco 
          }];
      }
      else { 
          return prevItems.map((item) => {
            if(item.id == product.id) {
              item.qty++;
              item.totalPrice += product.preco;
            }
            return item;
          });
      }
    });
  }

  function getItemsCount() {
      return items.reduce((sum, item) => (sum + item.qty), 0);
  }
  
  function getTotalPrice() {
      return items.reduce((sum, item) => (sum + item.totalPrice), 0);
  }
  
  function quantity(id, { isSum }) {
    setItems((prevItems) => { 
      return prevItems.map((item) => {
        if(item.id == id) {
          if(isSum) {
            item.qty++;
            item.totalPrice += item.product.preco;
          } else {
            item.qty--;
            item.totalPrice -= item.product.preco;
          }
        } 
        return item;
      });
    });
  }

  function removeItemToCart(id, msg, bckClr, {isAll}){
    if(isAll) {
      setItems([]);
    } else {
      setItems(items.filter(p=> p.id !== id));
    }
    setVisibleToast({visible: true, message: msg, backgroundColor: bckClr});
  }
  
  return (
    <CartContext.Provider 
      value={{items, setItems, getItemsCount, addItemToCart, getTotalPrice, quantity, removeItemToCart, visibleToast, setVisibleToast, error, setError}}>
      {props.children}
    </CartContext.Provider>
  );
}

