import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import Welcome from './Welcome';
import Navbar from './Navbar';
import DestinationContainer from './DestinationContainer';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import TripsContainer from './TripsContainer';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'nav-tripr',
      auth: {
        currentUser: {}
      }
    };

    this.handleLogin = (user) => {
      this.setState(prevState => {
        return {
          ...prevState,
          activeItem: 'nav-trips',
          auth: {
            ...prevState.auth,
            currentUser: user
          }
        };
      }, () => {
        localStorage.setItem('token', user.id);
      });
    };

    this.handleLogout = () => {
      // console.log(e.target);
      this.setState({
        activeItem: 'nav-tripr',
        auth: {
          currentUser: {}
        }
      }, () => {
        localStorage.clear();
      });

    };

    this.handleNavClick = (e) => {
      e.persist();
      this.setState(prevState => {
        return {
          ...prevState,
          activeItem: e.target.id
        };
      });
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token
        }
      };
      fetch('http://localhost:3001/api/v1/reauth', options)
        .then(resp => resp.json())
        .then(user => { this.setState({
          auth: {
            currentUser: user
          }
        });
        });
    }
  }

  renderContent() {
    switch (this.state.activeItem) {
    case 'nav-tripr':
      return <Welcome />;
    case 'nav-destinations':
      return <DestinationContainer />;
    case 'nav-trips':
      return <TripsContainer user={this.state.auth.currentUser}/>;
    case 'nav-login':
      return <LoginForm onLogin={this.handleLogin} />;
    case 'nav-signup':
      return <SignupForm onLogin={this.handleLogin} />;
    default:
      return <h1>404 Not Found</h1>;
    }
  }

  render() {
    // const loggedIn = !!this.state.auth.currentUser.id;
    return (
      <div id="main">
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <Navbar onNavClick={this.handleNavClick} currentUser={this.state.auth.currentUser} onLogout={this.handleLogout}/>
          {this.renderContent()}
        </Segment>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
