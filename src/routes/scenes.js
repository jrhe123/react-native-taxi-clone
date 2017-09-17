import React from "react";

// redux
import { Actions, Scene } from "react-native-router-flux";

// components
import HomeContainer from "./Home/container/HomeContainer";
import TrackDriverContainer from "./TrackDriver/container/TrackDriverContainer";


// Router configuration HERE
const scenes = Actions.create(
	<Scene key="root" hideNavBar>
		<Scene key="home" component={HomeContainer} title="home" initial />
		<Scene key="trackDriver" component={TrackDriverContainer} title="trackDriver" />
	</Scene>
);

export default scenes;

// <Scene key="root" hideNavBar>
// <Scene key="root" navigationBarStyle={{backgroundColor: '#000',borderBottomColor:"#1e2226"}}  titleStyle={{color : "#FFF"}}>
