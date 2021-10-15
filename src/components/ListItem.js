import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

const ListItem = () => {
  const [items, setItems] = useState([]);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  // get items
  useEffect(() => {
    const getItems = async () => {
      const docSnap = onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
        setItems(doc.data().items);
      });
    };
    getItems();
  }, []);

  return (
    <div>
      <h2>Names of Items in your shopping List</h2>
      {items.map((item) => {
        return (
          <div>
            <p>{item.itemName}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ListItem;
