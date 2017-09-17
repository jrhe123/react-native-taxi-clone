import update from "react-addons-update";
import constants from "./actionConstants";

// Google
import RNGooglePlaces from 'react-native-google-places'

// util
import request from '../../../util/request'
import calculateFare from '../../../util/fareCalculator'

// window size
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;



// 1. constants
const {
	SET_NAME,

	GET_CURRENT_LOCATION,
	GET_INPUT,
	TOGGLE_SEARCH_RESULT,
	GET_ADDRESS_PREDICTIONS,
	GET_SELECTED_ADDRESS,
	GET_DISTANCE_MATRIX,
	GET_FARE,
	BOOK_CAR,
	GET_NEARBY_DRIVERS,
	BOOKING_CONFIRMED,
} = constants;




// 2. actions & reducer handler
export function setName(){
	return{
		type: SET_NAME,
		payload: "ROY"
	}
}
function handleSetName(state, action){
	return update(state, {
		name: {
			$set: action.payload
		}
	})
}


export function getCurrentLocation(){
	console.log('action called, now go to the reducer handler');
	return(dispatch)=>{
		navigator.geolocation.getCurrentPosition((position) => {

			dispatch({
				type: GET_CURRENT_LOCATION,
				payload: position
			})
		}, (error) => {
			console.log('get current location: ', error);
		},
		{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		)
	}
}
function handleGetCurrentLocation(state, action){
	console.log('reducer called, now go back to component');
	return update(state, {
		region: {	// <-- match this name
			latitude: {
				$set:action.payload.coords.latitude
			},
			longitude: {
				$set:action.payload.coords.longitude
			},
			latitudeDelta: {
				$set: LATITUDE_DELTA
			},
			longitudeDelta: {
				$set: LONGITUDE_DELTA
			},
		}
	})
}


export function getInputData(payload){
	console.log('action called, now go to the reducer handler');
	return{
		type: GET_INPUT,
		payload: payload
	}
}
function handleGetInputData(state, action){
	console.log('reducer called, now go back to component');

	const { key, value } = action.payload
	return update(state, {
		inputData: {
			[key]: {
				$set: value
			}
		}
	})
}


export function toggleSearchResultModal(payload){
	console.log('action called, now go to the reducer handler');
	return{
		type: TOGGLE_SEARCH_RESULT,
		payload: payload
	}
}
function handleToggleSearchResultModal(state, action){
	console.log('reducer called, now go back to component');

	if(action.payload == 'pickUp'){
		return update(state, {
			resultTypes: {
				pickUp: {
					$set: true
				},
				dropOff: {
					$set: false
				}
			},
			predictions: {
				$set: {}
			}
		})
	}

	if(action.payload == 'dropOff'){
		return update(state, {
			resultTypes: {
				pickUp: {
					$set: false
				},
				dropOff: {
					$set: true
				}
			},
			predictions: {
				$set: {}
			}
		})
	}
}


export function getAddressPredictions(){
	console.log('action called, now go to the reducer handler');
	return(dispatch, store) => {

		let userInput = store().home.resultTypes.pickUp
										? store().home.inputData.pickUp
										: store().home.inputData.dropOff;
		RNGooglePlaces.getAutocompletePredictions(userInput, {
			country: 'US'
		})
		.then((results) => {
			dispatch({
				type: GET_ADDRESS_PREDICTIONS,
				payload: results
			})
		})
		.catch((error) => {
			console.log('err: ', error);
		})

	}
}
function handleGetAddressPredictions(state, action){
	console.log('reducer called, now go back to component');

	return update(state, {
		predictions: {
			$set: action.payload
		}
	})
}


export function getSelectedAddress(payload){
	console.log('action called, now go to the reducer handler');

	const dummyNumbers = {
		baseFare: 0.4,
		timeRate: 0.14,
		distanceRate: 0.97,
		surge: 1
	}
	return(dispatch, store) => {
		RNGooglePlaces.lookUpPlaceByID(payload)
		.then((results) => {
			dispatch({
				type: GET_SELECTED_ADDRESS,
				payload: results
			})
		})
		.then(() => {

			if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){

				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().home.selectedAddress.selectedPickUp.latitude + "," + store().home.selectedAddress.selectedPickUp.longitude,
					destinations:store().home.selectedAddress.selectedDropOff.latitude + "," + store().home.selectedAddress.selectedDropOff.longitude,
					mode:"driving",
					key:"AIzaSyA0z3M1f9--D7QydlfokGdFYDLYxUqXZsA"
				})
				.finish((error, res)=>{
					console.log("API res: ", res.body);
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
				})
			}
			setTimeout(function(){
				if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
					const fare = calculateFare(
						dummyNumbers.baseFare,
						dummyNumbers.timeRate,
						store().home.distanceMatrix.rows[0].elements[0].duration.value,
						dummyNumbers.distanceRate,
						store().home.distanceMatrix.rows[0].elements[0].distance.value,
						dummyNumbers.surge
					)
					dispatch({
						type: GET_FARE,
						payload: fare
					})
				}
			}, 1000)

		})
		.catch((error) => {
			console.log('err: ', error);
		})
	}
}
function handleGetSelectedAddress(state, action){
	console.log('reducer called, now go back to component');

	let selectedTitle = state.resultTypes.pickUp ? 'selectedPickUp' : 'selectedDropOff'
	return update(state, {
		selectedAddress: {
			[selectedTitle] : {
				$set: action.payload
			}
		},
		resultTypes: {
			pickUp:{
				$set: false
			},
			dropOff:{
				$set: false
			}
		}
	})
}
function handleGetDistanceMatrix(state, action){
	console.log('reducer called, now go back to component');

	return update(state, {
		distanceMatrix: {
			$set: action.payload
		}
	})
}
function handleGetFare(state, action){
	console.log('reducer called, now go back to component');

	return update(state, {
		fare: {
			$set: action.payload
		}
	})
}


export function bookCar(){
	console.log('action called, now go to the reducer handler');

	return(dispatch, store) => {

		const nearByDrivers = store().home.nearByDrivers;
		const nearByDriver = nearByDrivers[Math.floor(Math.random() * nearByDrivers.length)];

		const payload = {
			data: {
				userName: "roy",
				pickUp: {
					address: store().home.selectedAddress.selectedPickUp.address,
					name: store().home.selectedAddress.selectedPickUp.name,
					latitude: store().home.selectedAddress.selectedPickUp.latitude,
					longitude: store().home.selectedAddress.selectedPickUp.longitude
				},
				dropOff: {
					address: store().home.selectedAddress.selectedDropOff.address,
					name: store().home.selectedAddress.selectedDropOff.name,
					latitude: store().home.selectedAddress.selectedDropOff.latitude,
					longitude: store().home.selectedAddress.selectedDropOff.longitude
				},
				fare: store().home.fare,
				status: 'pending',
				nearByDriver: {
					socketId: nearByDriver.socketId,
					driverId: nearByDriver.driverId,
					latitude: nearByDriver.coordinate.coordinates[1],
					longitude: nearByDriver.coordinate.coordinates[0]
				}
			}
		}

		request.post('http://localhost:3000/api/bookings')
			.send(payload)
			.finish((error, res) => {
				dispatch({
					type: BOOK_CAR,
					payload: res.body
				})
			})

	}
}
function handleBookCar(state, action){
	console.log('reducer called, now go back to component');

	return update(state, {
		booking: {
			$set: action.payload
		}
	})
}


export function getNearByDrivers(){
	console.log('action called, now go to the reducer handler');
	return(dispatch, store) => {
		request.get('http://localhost:3000/api/driverLocation')
			.query({
				latitude: store().home.region.latitude,
				longitude: store().home.region.longitude
			})
			.finish((error, res) => {
				dispatch({
					type: GET_NEARBY_DRIVERS,
					payload: res.body
				})
			})
	}
}
function handleGetNearByDrivers(state, action){
	console.log('reducer called, now go back to component');

	return update(state, {
		nearByDrivers: {
			$set: action.payload
		}
	})
}


function handleConfirmBooking(state, action){

	return update(state, {
		booking: {
			$set: action.payload
		}
	})
}


function handleGetNearbyDrivers(state, action){
	return update(state, {
		nearByDrivers:{
			$set:action.payload
		}
	});
}


function handleBookingConfirmed(state, action){
    return update(state, {
        booking:{
            $set: action.payload
        }
    });

}







// 3. reducer
const ACTION_HANDLERS = {
	SET_NAME: handleSetName,		// pair the action


	GET_CURRENT_LOCATION: handleGetCurrentLocation,
	GET_INPUT: handleGetInputData,
	TOGGLE_SEARCH_RESULT: handleToggleSearchResultModal,
	GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions,
	GET_SELECTED_ADDRESS: handleGetSelectedAddress,
	GET_DISTANCE_MATRIX: handleGetDistanceMatrix,
	GET_FARE: handleGetFare,
	BOOK_CAR: handleBookCar,
	GET_NEARBY_DRIVERS: handleGetNearByDrivers,
	BOOKING_CONFIRMED: handleConfirmBooking,
}

const initialState = {
	region: {},
	inputData: {},
	resultTypes: {},
	selectedAddress: {},
};
export function HomeReducer (state = initialState, action){
	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state;
}
