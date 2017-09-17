1. react-native init MyApp
2. npm install --save-dev babel-preset-react-native@2.1.0
3. react-native run-ios
4. cmd + D => live reload
5. redux:
  > npm install react-redux redux-thunk react-native-router-flux react-addons-update --save
  > npm install redux-logger --save-dev

6. install ruby
7. install cocoapods
8. google map api (enable it!!)
9. npm install --save native-base
10. npm install --save react-native-maps
11. create file: ios/podfile
  > run: pod install
12. setup ios/MyApp.xcworkspace
  > AppDelegate.m => add line: @import GoogleMaps;
  > [GMSServices provideAPIKey:@"AIzaSyA0z3M1f9--D7QydlfokGdFYDLYxUqXZsA"];

13. re-run app: react-native run-ios
14. react native vector icons
  > npm install --save react-native-vector-icons
  > react-native link react-native-vector-icons
15. Autocomplete: google place API (enable it!!)
  > npm install --save react-native-google-places
  > react-native link react-native-google-places
  > change file: ios/podfile
  > run: pod install
  > edit: ios/MyApp.xcworkspace
  > AppDelegate.m => add line: @import GooglePlaces;
  > [GMSPlacesClient provideAPIKey:@"YOUR_IOS_API_KEY_HERE"];
16. Google Place Matrix => calculate taxi fare
17. NodeJS API
  > npm install --save express body-parser ejs
  > npm install --save mongojs
18. Mlab
19. socket.io & redux
  > npm install --save socket.io redux-socket.io
