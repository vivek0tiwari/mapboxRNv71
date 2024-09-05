import Mapbox from '@rnmapbox/maps';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TSiteData} from './InProgress';
import {useRoute} from '@react-navigation/native';
import SiteCard from '../components/SiteCard';
import {
  feature,
  bbox as turfBbox,
  featureCollection as turfFeatureCollection,
} from '@turf/turf';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug',
);

const SiteMap = () => {
  const [siteData, setSiteData] = useState<TSiteData | null>(null);
  const route = useRoute();
  const getData = async () => {
    const HobexModule = NativeModules.RNSiteModule;

    const data = await HobexModule.getSiteDetails(
      '"statusTitle":"In-Progress"',
    );
    if (typeof data === 'object' && route.params?.siteId) {
      const siteInfo = data[route.params.siteId] as TSiteData;
      setSiteData(siteInfo);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const bound = useMemo(() => {
    if (siteData?.shape) {
      const bbox = turfBbox(siteData.shape);
      return bbox;
    }
    return [];
  }, [siteData?.shape]);

  const featureCollection = useMemo(() => {
    if (siteData?.shape) {
      return turfFeatureCollection([feature(siteData.shape)]);
    }
    return turfFeatureCollection([]);
  }, [siteData?.shape]);

  console.log('bound', bound, featureCollection);

  if (siteData) {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            defaultSettings={{
              zoomLevel: 15,
              centerCoordinate: siteData.centroid.coordinates,
            }}
          />
          <Mapbox.ShapeSource id="site-source" shape={featureCollection}>
            <Mapbox.FillLayer
              id="siteBoundaryLayer"
              style={{
                fillColor: 'red',
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>

        <View style={styles.container}>
          <SiteCard {...siteData} />
        </View>
      </ScrollView>
    );
  }

  return <ActivityIndicator />;
};

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: 300,
    width: '100%',
  },
});

export default SiteMap;
