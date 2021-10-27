import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import Footer from './Footer';
import { check } from 'prettier';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');
  const currentCollectionRef = doc(db, 'shopping-list', currToken);

  useEffect(() => {
    const getItems = () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (!doc.data()) {
            setEmptyList(true);
          } else {
            setItems(doc.data().items);
          }
        });
    };
    getItems();
  }, []);

  const handlePurchaseInLastDay = (position) => {
    for (let item of items) {
      if (
        item.itemName === items[position].itemName &&
        Date.now() - item.lastPurchase < 60 * 60 * 24 * 1000
      ) {
        return true;
      }
    }
    return false;
  };

  const handleOnChange = (position) => {
    for (let item of items) {
      if (item.itemName === items[position].itemName) {
        item.lastPurchase = Date.now();
        updateDoc(currentCollectionRef, { items: items });
      }
    }
    setItems(items);
  };

  return (
    <div id="main-container" className="flex-wrapper">
      <div id="sub-wrapper">
        <h2>Names of Items in your shopping List</h2>
        {loading && <p>Loading ... </p>}
        {error && <p>An error occured</p>}
        {emptyList && <p>You dont have any list yet</p>}

        {items.map((item, index) => {
          return (
            <div key={index} className="item-wrapper">
              <div className="left-list-pane">
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  checked={handlePurchaseInLastDay(index)}
                  onChange={() => handleOnChange(index)}
                />
              </div>
              <div className="right-list-pane">
                <p>{item.itemName}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default ListItem;
