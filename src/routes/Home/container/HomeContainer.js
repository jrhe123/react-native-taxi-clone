// redux
import { connect } from "react-redux";

// components
import Home from "../components/Home";

// reducer
import {
  setName,


  getCurrentLocation,
  getInputData,
  toggleSearchResultModal,
  getAddressPredictions,
  getSelectedAddress,
  bookCar,
  getNearByDrivers,
} from "../module/home";


const mapStateToProps = (state) => ({

  // matched in module/home.js
  // state.yyyy <-- reducer name in store
  // state.home.xxx <-- handleSetName return xxx
  // converted to this.props.name
  name: state.home.name,


  region: state.home.region,
  inputData: state.home.inputData || {},
  resultTypes: state.home.resultTypes || {},
  predictions: state.home.predictions || [],
  selectedAddress: state.home.selectedAddress || {},
  fare: state.home.fare,
  booking: state.home.booking || {},
  nearByDrivers: state.home.nearByDrivers || [],
});

const mapActionCreators = {

  // matched in module/home.js
  // action function
  setName,


  getCurrentLocation,
  getInputData,
  toggleSearchResultModal,
  getAddressPredictions,
  getSelectedAddress,
  bookCar,
  getNearByDrivers,
};

// connected
export default connect(mapStateToProps, mapActionCreators)(Home);
