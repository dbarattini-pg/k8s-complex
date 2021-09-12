import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Fib from './Fib';
import OtherPage from './OtherPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="App-link">
            Home
          </Link>
          <Link to="/otherpage" className="App-link">
            Other Page
          </Link>
        </header>
        <main className="App-main">
          <Route exact path="/" component={Fib} />
          <Route exact path="/otherpage" component={OtherPage} />
        </main>
      </div>
    </Router>
  );
}

export default App;
