import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    emailInput: "",
    passwordInput: "",
    user: {}
  };

  handleChange = (prop, e) => {
    this.setState({
      [prop]: e
    });
  };

  signUp = async () => {
    let res = await axios.post("/api/signup", {
      email: this.state.emailInput,
      password: this.state.passwordInput
    });
  };

  login = async () => {
    let res = await axios.post("/api/login", {
      email: this.state.emailInput,
      password: this.state.passwordInput
    });
    this.setState({
      user: res.data.userData
    });
  };

  logout = async () => {
    let res = await axios.get("/logout");
    this.setState({
      user: res.data.userData
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Auth Mini</h1>
        <p>
          Email:
          <input
            onChange={e => this.handleChange("emailInput", e.target.value)}
          />
        </p>
        <p>
          Password:
          <input
            onChange={e => this.handleChange("passwordInput", e.target.value)}
          />
        </p>
        <button onClick={() => this.signUp()}>Sign Up</button>
        <button onClick={() => this.login()}>Login</button>
        <button onClick={() => this.logout()}>Logout</button>
        <hr/>
          <p>USER: {JSON.stringify(this.state.user)}</p>
      </div>
    );
  }
}

export default App;
