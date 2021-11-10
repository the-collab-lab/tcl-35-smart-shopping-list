import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { NavLink } from 'react-router-dom';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';
import { searchListHandler } from './customFilter/customFilter.js';
import { check } from 'prettier';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [searchlist, setSearchList] = useState('');

  const currToken = localStorage.getItem('currToken');
  let currentCollectionRef;
  const itemsCollectionRef = collection(db, 'shopping-list');
  const history = useHistory();
  const DayInMilliSeconds = 60 * 60 * 24 * 1000;

  if (currToken) {
    currentCollectionRef = doc(db, 'shopping-list', currToken);
  }

  //route to list
  const addItemBtn = () => {
    history.push('/add');
  };

  // get items
  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
      if (!currToken) {
        history.push('/');
      }
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

  const handlePurchaseInLastDay = (lastPurchase) => {
    if (!lastPurchase) return false;
    return Date.now() - lastPurchase < DayInMilliSeconds;
  };

  const handleOnChange = (itemName) => {
    for (let item of items) {
      if (item.itemName === itemName) {
        const daysSinceLastTransaction = item.lastPurchase
          ? Math.round((Date.now() - item.lastPurchase) / DayInMilliSeconds)
          : 0;
        item.estimatedPurchaseInterval = calculateEstimate(
          item.estimatedPurchaseInterval,
          daysSinceLastTransaction,
          item.totalPurchases,
        );
        item.lastPurchase = Date.now();
        item.totalPurchases = item.totalPurchases + 1;
        updateDoc(currentCollectionRef, { items: items });
      }
    }
    setItems(items);
  };

  const addBgColor = (nextPurchase) => {
    if (nextPurchase === 7) {
      return 'green-bg';
    } else if (nextPurchase === 14) {
      return 'yellow-bg';
    } else {
      return 'purple-bg';
    }
  };

  const addAriaLabel = (nextPurchase) => {
    if (nextPurchase === 7) {
      return '7 days';
    } else if (nextPurchase === 14) {
      return '14 days';
    } else {
      return '30 days';
    }
  };

  const DaysInMilliSeconds = 60 * 60 * 24 * 1000;

  const calculateActive = (item) => {
    if (item.totalPurchases <= 1) {
      return false;
    } else {
      return (
        ((Date.now() - item.lastPurchase) / item.estimatedPurchaseInterval) *
          DaysInMilliSeconds >
        2
      );
    }
  };

  const sortItems = (items) => {
    return items.sort((a, b) => {
      if (!a.estimatedPurchaseInterval || !calculateActive) {
        return -1;
      }

      if (!b.estimatedPurchaseInterval || !calculateActive) {
        return -1;
      }

      if (!a.estimatedPurchaseInterval && !b.estimatedPurchaseInterval) {
        if (a.itemName < b.itemName) {
          return -1;
        } else {
          return 1;
        }
      }

      if (a.estimatedPurchaseInterval < b.estimatedPurchaseInterval) {
        return -1;
      } else if (a.estimatedPurchaseInterval > b.estimatedPurchaseInterval) {
        return 1;
      } else {
        if (a.itemName < b.itemName) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  };

  sortItems(items);

  return (
    <div>
      <div id="main-container" className="flex-wrapper">
        <div id="sub-wrapper">
          <h2>Names of Items in your shopping List</h2>
          {loading && <p>Loading ... </p>}
          {error && <p>An error occured</p>}
          {emptyList && <p>You don't have any list yet</p>}

          <div className="filter">
            <label htmlFor="search" className="search-label">
              Filter items:
            </label>
            <br />
            <input
              type="search"
              placeholder="start typing here..."
              name="searchlist"
              className="search"
              onChange={(e) => setSearchList(e.target.value)}
            />
          </div>

          {searchListHandler({ value: searchlist, items }).length > 0 &&
            searchListHandler({ value: searchlist, items }).map((item) => {
              return (
                <div
                  key={item.itemName}
                  className={`${addBgColor(item.nextPurchase)} item-wrapper`}
                >
                  <div className="left-list-pane checkbox">
                    <input
                      type="checkbox"
                      id={item.itemName}
                      disabled={handlePurchaseInLastDay(item.lastPurchase)}
                      checked={handlePurchaseInLastDay(item.lastPurchase)}
                      onChange={() => handleOnChange(item.itemName)}
                    />
                  </div>
                  <div className="right-list-pane">
                    <p aria-label={addAriaLabel(item.nextPurchase)}>
                      {item.itemName}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <section>
        {emptyList && <button onClick={addItemBtn}>Add Item</button>}
      </section>
      <Footer />
    </div>
  );
};

export default ListItem;
