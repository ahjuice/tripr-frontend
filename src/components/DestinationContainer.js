import React, { Component } from 'react';
import DestinationCard from './DestinationCard';
import { Item } from 'semantic-ui-react';

class DestinationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: [],
      showActivities: false
    };

    this.activityClick = (e) => {
      console.log(e.target);
      console.log(this.state.showActivities);
      this.setState({
        showActivities: !this.state.showActivities
      });
    };
  }

  componentDidMount() {
    this.getDestinations();
  }

  getDestinations() {
    fetch('http://localhost:3001/api/v1/destinations')
      .then(resp => resp.json())
      .then(json => this.setState(prevState => {
        return {
          ...prevState,
          destinations: json
        };
      }));
  }



  renderDestinationCards() {
    return this.state.destinations.map(destination => {
      const key = `destination-${destination.id}`;
      return (
        <DestinationCard handleClick={this.activityClick} key={key} {...destination} showActivity={this.state.showActivities}/>
      );
    });
  }

  render() {
    return (
      <div id='destinations-container'>
        <h1>Top Destinations</h1>
        <Item.Group>
          {this.renderDestinationCards()}
        </Item.Group>
      </div>
    );
  }
}

export default DestinationContainer;
