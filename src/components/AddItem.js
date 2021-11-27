import React from 'react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
  onSnapshot,
} from '@firebase/firestore';
import Footer from './Footer';
import { validateInput } from './Validation';
import { Button, Container, Card, ButtonGroup } from 'react-bootstrap';

const AddItem = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [nextPurchase, setNextPurchase] = useState(7);
  const lastPurchase = null;
  const [hasError, setHasError] = useState('false');
  const [errors, setErrors] = useState('');

  const errorsList = {
    empty: 'Make sure you add an item',
    duplicate: 'Item already exists',
  };

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  useEffect(() => {
    const getItems = async () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (doc.data()) setItems(doc.data().items);
        });
    };
    getItems();
  }, []);

  const addItems = async () => {
    const refData = await getDocs(itemsCollectionRef);
    let tokenList = refData.docs.map(({ id }) => id);

    const newList = {
      itemName,
      nextPurchase,
      lastPurchase,
      estimatedPurchaseInterval: null,
      totalPurchases: 0,
    };

    if (tokenList.includes(currToken)) {
      if (validateInput({ newList, setErrors, errorsList, items })) {
        await updateDoc(doc(db, 'shopping-list', currToken), {
          items: arrayUnion(newList),
        });
      } else {
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }
    } else {
      if (validateInput({ newList, setErrors, errorsList, items })) {
        await setDoc(doc(db, 'shopping-list', currToken), {
          items: [newList],
        });
      }
    }
  };

  const calculateNextPurchase = (purchaseTime) => {
    if (purchaseTime === 'Not soon') {
      return 30;
    } else if (purchaseTime === 'Kind of soon') {
      return 14;
    } else {
      return 7;
    }
  };

  const clearFormElements = () => {
    setItemName('');
    document.getElementById('soon').checked = false;
    document.getElementById('kindOfSoon').checked = false;
    document.getElementById('notSoon').checked = false;
  };

  const handleValueChange = (e) => {
    setNextPurchase(calculateNextPurchase(e.target.value));
  };

  const handleClick = (e) => {
    e.preventDefault();
    addItems();
    clearFormElements();
  };

  return (
    <Container>
      <Card border="white">
        <div
          id="main-container"
          className="add-items bg-success text-white mx-auto mt-5 rounded-3"
        >
          <div className="mx-auto">
            <Card.Body>
              <h1 className="text-center">What To Buy</h1>
              <form id="sub-wrapper" onSubmit={handleClick}>
                <div className="form-item mx-auto text-center mt-3">
                  {hasError && <p className="error"> {errors} </p>}

                  <h2 className="text-center mt-3">I want to buy:</h2>
                  <input
                    type="text"
                    placeholder="Bread"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                    }}
                    className="mx-auto d-block mt-3"
                  />
                </div>

                <div className="form-item text-center mt-5">
                  <fieldset>
                    <legend>How soon?</legend>
                    <input
                      type="radio"
                      name="timeToBuy"
                      id="soon"
                      value="soon"
                      onChange={handleValueChange}
                      checked
                    />
                    <label htmlFor="soon">Soon</label>
                    <input
                      type="radio"
                      name="timeToBuy"
                      id="kindOfSoon"
                      value="Kind of soon"
                      onChange={handleValueChange}
                    />
                    <label htmlFor="kindOfSoon">Kind of Soon</label>
                    <input
                      type="radio"
                      name="timeToBuy"
                      id="notSoon"
                      value="Not soon"
                      onChange={handleValueChange}
                    />
                    <label htmlFor="notSoon">Not Soon</label>
                  </fieldset>
                </div>

                <Button
                  type="submit"
                  className="form-item mx-auto d-block mt-5"
                  variant="light"
                >
                  Add Item
                </Button>
              </form>
            </Card.Body>
          </div>
        </div>
      </Card>
      <Footer />
    </Container>
  );
};

export default AddItem;
