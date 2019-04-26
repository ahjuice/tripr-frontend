import React from 'react';
import { Item, Button } from 'semantic-ui-react';
import TripCard from './TripCard';
import NewTripForm from './NewTripForm';

class TripsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: [],
      trips: [],
      showActivities: false,
      showForm: false,
    };
  }

  componentDidMount() {
    this.getTrips(this.props.user.id);
    this.getDestinations();
  }

  getDestinations() {
    fetch('https://tripr-backend.herokuapp.com/api/v1/destinations')
      .then(resp => resp.json())
      .then(destinations => this.setState({ destinations }));
  }

  getTrips(id) {
    fetch(`https://tripr-backend.herokuapp.com/api/v1/users/${id}/trips`)
      .then(resp => resp.json())
      .then(trips => this.setState({ trips }));
  }

  activityClick = e => {
    this.setState({
      showActivities: !this.state.showActivities,
    });
  };

  updateTrips = newTrips => {
    this.setState({
      trips: newTrips,
    });
  };

  toogleForm = e => {
    this.setState({
      showForm: !this.state.showForm,
    });
  };

  renderTripCards() {
    const reversedTrips = this.state.trips.reverse();
    return reversedTrips.map(trip => {
      const key = `trip-${trip.id}`;
      return (
        <TripCard
          handleClick={this.activityClick}
          key={key}
          {...trip}
          showActivity={this.state.showActivities}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.toogleForm}>
          {this.state.showForm ? 'Close Form' : 'New Trip'}
        </Button>
        {this.state.showForm ? (
          <NewTripForm
            user_id={this.props.user.id}
            trips={this.state.trips}
            destinations={this.state.destinations}
            updateTrips={this.updateTrips}
            toogleForm={this.toogleForm}
          />
        ) : null}
        <h1>{this.props.user.username}'s Trips</h1>

        <Item.Group>{this.renderTripCards()}</Item.Group>
      </div>
    );
  }
}

export default TripsContainer;
