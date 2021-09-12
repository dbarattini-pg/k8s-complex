import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fib.css';

const Fib = () => {
  const [values, setValues] = useState({});
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [index, setIndex] = useState('');

  const fetchValues = async () => {
    const response = await axios.get('/api/values/current');
    setValues(response.data);
  };
  const fetchIndexes = async () => {
    const response = await axios.get('/api/values/all');
    setSeenIndexes(response.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () =>
    seenIndexes.map(({ number }) => number).join(', ');

  const renderValues = () => {
    const entries = [];
    Object.keys(values).forEach((key) =>
      entries.push(
        <div key={key}>
          For index {key} I&apos;ve calculated {values[key]}
        </div>
      )
    );
    return entries;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/values', {
        index,
      });
    } catch (e) {
      if (e.response?.status === 422) {
        // eslint-disable-next-line no-alert
        alert(e.response?.data);
      }
    }
    setIndex('');
    fetchValues();
    fetchIndexes();
  };

  return (
    <div className="Fib-container">
      <div className="Fib-title">
        <h1>Fib Calculator</h1>
      </div>
      <div className="Fib-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="index">
            Enter your index:
            <input
              id="index"
              type="number"
              value={index}
              onChange={(event) => setIndex(event.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <h3>Indexes I have seen:</h3>
        {renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {renderValues()}
      </div>
    </div>
  );
};

export default Fib;
