import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase.js';
import { collection, getDocs } from '@firebase/firestore';
import Error from './Error';
import shoppingIllustration from '../assets/undraw_shopping_app_flsj.svg';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormControl,
  Ratio,
} from 'react-bootstrap';

const Home = () => {
  const [joinlist, setJoinList] = useState('');
  const [noSharedToken, setNoSharedToken] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const existingToken = localStorage.getItem('currToken');
  let token = existingToken ? existingToken : '';
  const history = useHistory();
  const itemsCollectionRef = collection(db, 'shopping-list');

  if (token) {
    history.push('/list');
  }

  const fetchTokens = async () => {
    const refData = await getDocs(itemsCollectionRef);
    console.log(refData);
    let tokenList = refData.docs.map(({ id }) => id);

    if (!tokenList.includes(joinlist)) {
      setNoSharedToken(true);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } else {
      localStorage.setItem('currToken', joinlist);
      history.push('/list');
    }
  };

  const handleClick = function () {
    // if (!token) {
    //   localStorage.setItem('currToken', getToken());
    // }
    // history.push('/list');
    console.log('Creating new lists is no longer supported.');
  };

  const handleChange = (e) => {
    const { value } = e.currentTarget;
    setJoinList(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTokens();
  };

  return (
    <>
      <Container fluid className="home-container">
        <Row className="m-2 p-3">
          <Col className="mx-auto d-block d-none d-sm-none d-md-none d-lg-block">
            <header>
              <Ratio aspectRatio={87}>
                <img
                  src={shoppingIllustration}
                  alt="a woman with a shopping cart"
                  fluid
                  className="mx-auto d-block"
                />
              </Ratio>
            </header>
          </Col>

          <Col className="mx-auto d-block text-dark">
            <main>
              <h1 className="text-center text-success py-2">Smart Shopping</h1>
              <section>
                <h2 className="h3 text-center py-3">
                  Enter your three words token
                </h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="token" className="clearfix">
                    <Form.Label aria-label="enter your three words token">
                      <span hidden aria-hidden="true">
                        User Token
                      </span>
                    </Form.Label>
                    <FormControl
                      className="p-3"
                      id="token"
                      type="text"
                      placeholder="three words token"
                      name="joinlist"
                      value={joinlist}
                      onChange={handleChange}
                    />
                    {noSharedToken && showErrorMessage && (
                      <Error errorMessage="Token does not exist. Enter a valid token." />
                    )}
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-success"
                    className="btn w-100 p-3 mt-3"
                  >
                    Join an existing list
                  </Button>
                </Form>
              </section>

              <section className="py-3">
                <h2 className="h3 py-2">Don't have a list?</h2>
                <Button
                  variant="outline-success"
                  className="btn w-100 p-3"
                  onClick={() => handleClick()}
                >
                  Create a new list
                </Button>
              </section>
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
