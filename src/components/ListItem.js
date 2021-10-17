import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // get items
  useEffect(() => {
    setLoading(true);
    const getItems = () => {
      try {
        const itemsCollectionRef = collection(db, 'shopping-list');
        const queryShoppingList = query(itemsCollectionRef);

        onSnapshot(queryShoppingList, (querySnapshot) => {
          const items = querySnapshot.docs.reduce((acc, doc) => {
            const { itemName, buyingTime } = doc.data();
            const id = doc.id;
            return [...acc, { id, itemName, buyingTime }];
          }, []);

          setItems(items);
          setLoading(false);
        });
      } catch (e) {
        setError(true);
      }
    };

    getItems();
  }, []);

  return (
    <div>
      {error && <p>An error occured while getting your items</p>}
      {loading && <p>Loading...</p>}
      {items.map((item) => {
        return (
          <div>
            <p>Name of Item: {item.itemName}</p>
            <p>Buying Time: {item.buyingTime}</p>
          </div>
        );
      })}
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

export default ListItem;
