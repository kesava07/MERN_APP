import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './Components/Layout/Navbar';
import LandingPage from './Components/Layout/Landing';
import Login from './Components/Layout/Auth/Login';
import Register from './Components/Layout/Auth/Register';
//Redux
import { Provider } from 'react-redux';
import store from './Store';
import Alert from './Components/Layout/Alert';
import { loadUser } from './Actions/Auth';
import setAuthToken from './Utils/SetAuthToken';
import './App.css';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Route exact path="/" component={LandingPage} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </section>
      </Router>
    </Provider>
  )
}

export default App;
