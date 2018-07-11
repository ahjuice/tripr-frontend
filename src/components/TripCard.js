import React from 'react';
import { Item, Button, Header, Popup, Grid } from 'semantic-ui-react';
import ActivitiesContainer from './ActivitiesContainer';
import DestinationCard from './DestinationCard';


class TripCard extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    showActivities: this.props.showActivity,
    activities: [],
    destination: ''
  }
}

componentDidMount() {
  this.getDestination(this.props.destination_id)
  this.getActivities(this.props.destination_id)
}

getDestination(id) {
  fetch('http://localhost:3001/api/v1/destinations/' + id )
  .then(resp => resp.json())
  .then(destination => this.setState({ destination }))
}

getActivities(id) {
  fetch('http://localhost:3001/api/v1/destinations/' + id + '/activities')
  .then(resp => resp.json())
  .then(activities => this.setState({ activities }))
}

clickChangeState = (e) => {
  this.setState({
    showActivities: !this.state.showActivities
  })
}

addActivity = (e) => {
  // console.log(e.target);
  // console.log(this.props.destination_id);
  // console.log(this.state.destination);
  console.log(this.state.activities);
}

assignActivity(id, data) {
  fetch('http://localhost:3001/api/v1/trips/' + id, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

  render() {
    if (this.state.activities.length !== 0){
    return(
      <div>
        <Item  className='trip-card-item'>
          <Item.Header as='h1'>{this.props.name}</Item.Header>

          <div className='trip-card'>
            {/* <Button onClick={this.addActivity}>Add an Activity</Button> */}
            <Popup trigger={<Button onClick={this.addActivity} >Add an Activity For {this.state.destination.name}</Button>} flowing hoverable>
              <Grid centered divided columns={this.state.activities.length}>
                {this.state.activities.map((activity) => {
                  return<Grid.Column textAlign='center'>
                    <Header as='h4'>{activity.name}</Header>
                    <img src={activity.thumbnail} alt={activity.name} height="150" width="150" />
                    <div><Button onClick={() => {this.assignActivity(this.props.id, {activity_id: activity.id})}}>Add</Button></div>
                  </Grid.Column>
                })}
              </Grid>
            </Popup>
            <Item.Content className='trip-card-content'>

              <Item.Image onClick={this.clickChangeState} size='medium' src={this.state.destination.thumbnail} />
              <Item.Meta className='trip-card-meta'>
                <br></br>
              </Item.Meta>
              <Item.Description className='trip-card-description'>
                {this.state.destination.name}
              </Item.Description>

            </Item.Content>
          </div>
        </Item>

        {this.state.showActivities ? <h1>Your Activities</h1> : null}
        {this.state.showActivities ? <ActivitiesContainer url={`http://localhost:3001/api/v1/trips/${this.props.id}/activities`}/> : null}
      </div>
    )} else {
      return null
    }
  }

}

export default TripCard;