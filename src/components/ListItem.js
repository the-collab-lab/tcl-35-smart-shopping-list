import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, 'shopping-list');

  // get items
  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(itemsCollectionRef);
      setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getItems();
  }, []);

  return (
    <div>
      {items.map((item) => {
        return (
          <div>
            <p>Name of Item: {item.itemName}</p>
            <p>Buying Time: {item.buyingTime}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ListItem;
