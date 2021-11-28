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
import NavBar from './NavBar';
import Footer from './Footer';
import { validateInput } from './Validation';
import { Button, Container, Card, Form, InputGroup } from 'react-bootstrap';

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
        setTimeout(() => setHasError(false), 30000);
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
    <>
      <NavBar title="Smart Shopping Plan" />
      <main>
        <Container fluid>
          <Card
            style={{ width: '80%' }}
            className="border-success text-dark mx-auto d-block mt-5 p-3"
          >
            <Card.Body>
              <Card.Title>
                <h1 className="text-success text-center">What To Buy</h1>
              </Card.Title>
              <Form onSubmit={handleClick}>
                <Form.Group className="text-center" controlId="itemName">
                  {hasError && <p className="alert-danger"> {errors} </p>}

                  <Form.Label aria-label="Insert your item here">
                    <span hidden aria-label="hidden">
                      I want to buy:
                    </span>
                  </Form.Label>
                  <InputGroup className="mx-auto w-50">
                    <Form.Control
                      type="text"
                      className="p-2"
                      placeholder="Bread"
                      id="itemName"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="text-center my-4">
                  <fieldset>
                    <legend>How soon?</legend>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="timeToBuy"
                        id="soon"
                        value="soon"
                        autocomplete="off"
                        onChange={handleValueChange}
                      />
                      <label className="form-check-label" htmlFor="soon">
                        Soon
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="timeToBuy"
                        id="kindOfSoon"
                        value="Kind of soon"
                        autocomplete="off"
                        onChange={handleValueChange}
                      />
                      <label className="form-check-label" htmlFor="kindOfSoon">
                        Kind of Soon
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="timeToBuy"
                        id="notSoon"
                        value="Not soon"
                        autocomplete="off"
                        onChange={handleValueChange}
                      />
                      <label className="form-check-label" htmlFor="notSoon">
                        Not Soon
                      </label>
                    </div>
                  </fieldset>
                </Form.Group>

                <Button
                  type="submit"
                  variant="outline-success"
                  className="mx-auto d-block btn w-50 p-2 mt-3"
                >
                  Add Item
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Footer />
        </Container>
      </main>
    </>
  );
};

export default AddItem;
