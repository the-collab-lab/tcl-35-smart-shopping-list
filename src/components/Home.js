import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';

const Home = () => {
  const [token, setToken] = useState(getToken);
  const history = useHistory();

  let localToken = localStorage.getItem('currToken');

  if (localToken) {
    history.push('/list');
  }

  const handleClick = function () {
    setToken(token);
  };

  useEffect(() => {
    localStorage.setItem('currToken', JSON.stringify(token));
  }, [token]);

  return (
    <header className="home-header">
      <section className="welcome">
        <h1>Welcome to your Smart Shopping list!</h1>
      </section>
      <section className="create">
        <button onClick={() => handleClick()}>Create a new list</button>
        <p>- or -</p>
      </section>
      <section className="join">
        <p>Join an existing shopping list by entering a three word token.</p>
        <form action="">
          <div>
            <label htmlFor="token">Share token</label>
            <br />
            <input type="text" id="token" />
          </div>
        </form>
        <button>Join an existing list</button>
      </section>
    </header>
  );
};

export default Home;
