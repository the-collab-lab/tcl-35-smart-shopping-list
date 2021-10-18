import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';

const Home = () => {
  // const existingToken = localStorage.getItem('currentToken');
  const [joinlist, setJoinList] = useState('');
  const [token, setToken] = useState(() => {
    const existingToken = localStorage.getItem('currToken');
    return existingToken ? existingToken : '';
  });

  const history = useHistory();

  if (token) {
    history.push('/list');
  }

  const handleClick = function () {
    if (!token) {
      localStorage.setItem('currToken', getToken());
    }
    history.push('/list');
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    if (name === 'joinlist') {
      setJoinList(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('clicked');
    if (joinlist) {
      localStorage.setItem('currToken', joinlist);
      console.log(joinlist);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token">Share token</label>
            <br />
            <input
              placeholder="three word token"
              type="text"
              name="joinlist"
              value={joinlist}
              onChange={handleChange}
            />
          </div>
          <button>Join an existing list</button>
        </form>
      </section>
    </header>
  );
};

export default Home;
