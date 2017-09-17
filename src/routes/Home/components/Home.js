import React, { Component } from 'react'
import{ View, Text } from 'react-native'

// components
import MapContainer from './MapContainer'
import Fare from './Fare'
import Fab from './Fab'
import FindDriver from './FindDriver'
import HeaderComponent from '../../../components/HeaderComponent'
import FooterComponent from '../../../components/FooterComponent'

// libraries
import { Container } from 'native-base'

// Router
import { Actions } from 'react-native-router-flux'


const taxiLogo = require('../../../assets/img/taxi_logo_white.png')
const carMarker = require('../../../assets/img/carMarker.png')

// ! All redux action called here
// child component pass back to here
class Home extends Component{

  componentDidMount(){

    // call props action func to trigger "action -> reducer -> component"
    //this.props.setName();

    var rx = this;
    this.props.getCurrentLocation();

    setTimeout(function(){
      rx.props.getNearByDrivers();
    }, 1000)

  }

  componentDidUpdate(prevProps, prevState){

    // GO TO OTHER PAGE!!
    if(this.props.booking.status == 'confirmed'){
      Actions.trackDriver({type: "reset"})
    }
  }


  render(){

    const region = {
			latitude:43.885407,
			longitude:-79.303094,
			latitudeDelta:0.0922,
			longitudeDelta:0.0421
		}

    const { status } = this.props.booking;

    return(
      <Container>
        { (status != 'pending') &&
          <View style={{flex: 1}}>
            <HeaderComponent logo={taxiLogo}/>
            {
              this.props.region.latitude &&
              <MapContainer
                carMarker={carMarker}
                nearByDrivers={this.props.nearByDrivers}
                region={this.props.region}
                getInputData={this.props.getInputData}
                toggleSearchResultModal={this.props.toggleSearchResultModal}
                getAddressPredictions={this.props.getAddressPredictions}
                resultTypes={this.props.resultTypes}
                predictions={this.props.predictions}
                getSelectedAddress={this.props.getSelectedAddress}
                selectedAddress={this.props.selectedAddress} />
            }
            <Fab onPressAction={() => this.props.bookCar()}/>
            {
              this.props.fare &&
              <Fare fare={this.props.fare}/>
            }
            <FooterComponent />
          </View>
          ||
          <FindDriver selectedAddress={this.props.selectedAddress} />
        }

      </Container>
    )
  }
}
export default Home
