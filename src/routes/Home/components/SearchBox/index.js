import React from 'react'
import{ Text } from 'react-native'

// libraries
import { View, InputGroup, Input } from 'native-base'

import Icon from 'react-native-vector-icons/FontAwesome'

// styles
import styles from './SearchBoxStyles'


export const SearchBox = ({getInputData, toggleSearchResultModal, getAddressPredictions, selectedAddress}) => {

  const { selectedPickUp, selectedDropOff } = selectedAddress || {};

  function handleInput(key, val){
    // pass to parent component
    getInputData({
      key: key,
      value: val
    })

    getAddressPredictions()
  }

  return(
    <View style={styles.searchBox}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>PICK UP</Text>
        <InputGroup>
          <Icon name="search" size={15} color="#FF5E3A" />
          <Input style={styles.inputSearch}
                 placeholder="Choose pick-up location"
                 value={selectedPickUp && selectedPickUp.name}
                 onChangeText={handleInput.bind(this, 'pickUp')}
                 onFocus={() => toggleSearchResultModal('pickUp')} />
        </InputGroup>
      </View>
      <View style={styles.secondInputWrapper}>
        <Text style={styles.label}>DROP OFF</Text>
        <InputGroup>
          <Icon name="search" size={15} color="#FF5E3A" />
          <Input style={styles.inputSearch}
                 placeholder="Choose drop-off location"
                 value={selectedDropOff && selectedDropOff.name}
                 onChangeText={handleInput.bind(this, 'dropOff')}
                 onFocus={() => toggleSearchResultModal('dropOff')} />
        </InputGroup>
      </View>
    </View>
  )
}

export default SearchBox
