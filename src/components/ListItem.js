import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  // get items
  useEffect(() => {
    const getItems = async () => {
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

  return (
    <div id="main-container" className="flex-wrapper">
      <div id="sub-wrapper">
        <h2>Names of Items in your shopping List</h2>
        {loading && <p>Loading ... </p>}
        {error && <p>An error occured</p>}
        {emptyList && <p>You dont have any list yet</p>}

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
