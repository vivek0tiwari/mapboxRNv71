/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {NativeModules} from 'react-native';
// {
//   "type": "FeatureCollection",
//   "name": "GeoJsonData",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {
//         "description": null,
//       },
//       "geometry": {
//         "type": "MultiPolygon",
//         "coordinates": [
//           [
//             [
//               [46.6973896223821, 24.7938909593501],
//               [46.69730684623009, 24.79405349682493],
//               [46.69722194475514, 24.79401653642232],
//               [46.69730416732871, 24.79385517629931],
//               [46.6973896223821, 24.7938909593501]
//             ]
//           ]
//         ]
//       }
//     },
// }
function InProgress(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [polygons, setPolygons] = useState<any>();
  const getData = async () => {
    console.log(NativeModules);
    const HobexModule = NativeModules.RNSiteModule;

    const data = await HobexModule.getSiteDetails(
      '"statusTitle":"In-Progress"',
    );
    const polygons = Object.keys(data).map(shapeObjects => {
      const shapeData = data[shapeObjects];
      return {
        type: 'Feature',
        properties: {
          description: null,
        },
        geometry: shapeData.shape,
      };
    });
    await setPolygons(polygons);
    console.log('db Data1', JSON.stringify(polygons));
  };

  useEffect(() => {
    getData();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>InProgress</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default InProgress;
