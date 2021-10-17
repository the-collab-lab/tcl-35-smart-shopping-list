import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from '@firebase/firestore';
import { NavLink } from 'react-router-dom';

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async (e) => {
    try {
      setLoading(true);

      await addDoc(collection(db, 'shopping-list'), {
        itemName: 'sugar',
        buyingTime: 'today',
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
      <footer>
        <nav className="links-wrapper">
          <ul className="links">
            <li>
              <NavLink to="/list" activeClassName="active">
                List
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" activeClassName="active">
                Add Item
              </NavLink>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default AddItem;
