import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App.jsx";
import NotFound from "./404";
import Login from "./Login";

export default class Routers extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/404" component={NotFound} />
          <Route path="/signin" component={Login} />
          <Route path="/signup" component={Login} />
          <Route component={App} />
        </Switch>
      </Router>
    );
  }
}
