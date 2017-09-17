import React, { Component } from "react";

// redux
import createStore from "./store/createStore";

// components
import AppContainer from "./AppContainer";


class Root extends Component{

	renderApp(){
		const initialState = window.___INTITIAL_STATE__;
		const store = createStore(initialState);

		return (
			<AppContainer store={store} />
		);
	}

	render(){
		return this.renderApp();
	}
}

export default Root
