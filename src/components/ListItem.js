import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  // get items
  useEffect(() => {
    setLoading(true);
    // const getItems = async () => {
    //   const docSnap = onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
    //     console.log(doc.data());
    //     // setItems(doc.data().items);
    //     setLoading(false);
    //   });
    // };
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
        // setError(true);
      }
    };
    getItems();
  }, []);

  if (loading) return <p>Loading ... </p>;

  return (
    <div id="main-container" className="flex-wrapper">
      <div id="sub-wrapper">
        <h2>Names of Items in your shopping List</h2>
        {items.map((item) => {
          return (
            <div className="item-wrapper">
              <p>{item.itemName}</p>
            </div>
          );
        })}
      </div>
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
