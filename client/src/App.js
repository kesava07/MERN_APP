import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './Components/Layout/Navbar';
import LandingPage from './Components/Layout/Landing';
import Login from './Components/Layout/Auth/Login';
import Register from './Components/Layout/Auth/Register';
import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Route exact path="/" component={LandingPage} />
      <section className="container">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </section>
    </Router>
  )
}

export default App;
