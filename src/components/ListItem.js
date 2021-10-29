import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [renderInput, setRenderInput] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');
  const history = useHistory();

  const addItemBtn = () => {
    history.push('/add');
  };

  // get items
  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (!doc.data()) {
            setEmptyList(true);
            setLoading(false);
          } else {
            setItems(doc.data().items);
            setLoading(false);
          }
        });
    };
    getItems();
  }, []);

  return (
    <div>
      <section id="">
        <div id="main-container">
          <h2>Names of Items in your shopping List</h2>
          {loading && <p>Loading ... </p>}
          {error && <p>An error occured</p>}
          {emptyList && <p>You don't have any list yet</p>}
          {items.map((item) => {
            return (
              <div className="item-wrapper">
                <p key="item.itemName">{item.itemName}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        {emptyList && <button onClick={addItemBtn}>Add Item</button>}
      </section>
      <Footer />
    </div>
  );
};

export default ListItem;
