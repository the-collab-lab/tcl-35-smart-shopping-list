import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from '@firebase/firestore';

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async (e) => {
    try {
      setLoading(true);

      await addDoc(collection(db, 'shopping-list'), {
        itemName: 'soap',
        buyingTime: 'soon',
      });

      setLoading(false);
    } catch (error) {
      setError(true);
      console.log('Error adding shopping-list:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Add Item</button>
    </div>
  );
};

export default AddItem;
