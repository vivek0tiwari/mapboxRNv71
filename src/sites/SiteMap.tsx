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
import aidImages from './patternsMapping';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug',
);

const SiteMap = () => {
  const [siteData, setSiteData] = useState<TSiteData | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const route = useRoute();
  const getData = async () => {
    const HobexModule = NativeModules.RNSiteModule;

    const data = await HobexModule.getSiteDetails(
      '"statusTitle":"In-Progress"',
    );
    const habitaData = await HobexModule.getSiteHabitatDetails(
      route.params?.siteId,
    );
    const habitatList = habitaData.data.map(habitatDetail => {
      const habitatData = JSON.parse(habitatDetail.response);
      return {...habitatData.shape, aidashCode: habitatDetail.aidashCode};
    });

    // setSiteData(habitatList);
    console.log('siteHabitatData', habitatList, habitaData);
    if (typeof data === 'object' && route.params?.siteId) {
      const siteInfo = data[route.params.siteId] as TSiteData;
      siteInfo.habitatShapes = habitatList;
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

  const polygonfeatureCollection = useMemo(() => {
    if (siteData?.shape) {
      return turfFeatureCollection(
        siteData.habitatShapes
          .filter(_ftr => _ftr.type === 'Polygon')
          .map(ftr => feature(ftr, {aidashCode: ftr.aidashCode})),
      );
    }
    return turfFeatureCollection([]);
  }, [siteData?.shape]);

  const lineFeatureCollection = useMemo(() => {
    if (siteData?.shape) {
      return turfFeatureCollection(
        siteData.habitatShapes
          .filter(_ftr => _ftr.type === 'LineString')
          .map(ftr => feature(ftr)),
      );
    }
    return turfFeatureCollection([]);
  }, [siteData?.shape]);

  const pointFeatureCollection = useMemo(() => {
    if (siteData?.shape) {
      return turfFeatureCollection(
        siteData.habitatShapes
          .filter(_ftr => _ftr.type === 'Point')
          .map(ftr => feature(ftr)),
      );
    }
    return turfFeatureCollection([]);
  }, [siteData?.shape]);

  const onPressPolygon = e => {
    const _feature = e?.features[0];
    console.log('onPressPolygon', _feature);
    setSelectedFeature(_feature);
  };

  console.log('polygonfeatureCollection', polygonfeatureCollection, siteData);

  const SelectedPolygon = () =>
    selectedFeature ? (
      <Mapbox.ShapeSource
        id="selectedNYC"
        shape={turfFeatureCollection([selectedFeature])}>
        <Mapbox.FillLayer
          sourceID="selectedNYC"
          id="nycSelectedFillRed"
          style={{
            fillColor: 'green',
          }}
        />
        <Mapbox.LineLayer
          sourceID="selectedNYC"
          id="nycFillLine2"
          style={{lineColor: '#f0efef', lineWidth: 1}}
        />
      </Mapbox.ShapeSource>
    ) : null;

  // console.log('bound', bound, featureCollection);

  if (siteData) {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Images
            images={{
              ...aidImages,
            }}
          />
          <Mapbox.Camera
            defaultSettings={{
              zoomLevel: 15,
              centerCoordinate: siteData.centroid.coordinates,
            }}
          />

          <Mapbox.ShapeSource
            id="site-poly"
            shape={polygonfeatureCollection}
            onPress={onPressPolygon}>
            <Mapbox.FillLayer
              id="siteBoundaryLayer"
              style={{
                fillPattern: ['get', 'aidashCode'],
                // fillColor: '#e153537c',
              }}
            />
            <Mapbox.LineLayer
              sourceID="site-poly"
              id="polyLine"
              style={{lineColor: '#000', lineWidth: 1}}
            />
          </Mapbox.ShapeSource>
          <Mapbox.ShapeSource
            id="site-source-line"
            shape={lineFeatureCollection}>
            <Mapbox.LineLayer
              sourceID="site-source-line"
              id="line"
              style={{lineColor: '#FFF', lineWidth: 2}}
            />
          </Mapbox.ShapeSource>
          <Mapbox.ShapeSource
            id="site-source-point"
            shape={pointFeatureCollection}>
            <Mapbox.CircleLayer
              sourceID="site-source-point"
              id="dot"
              style={{
                circleRadius: 4,
                circleStrokeWidth: 1,
                circleStrokeColor: '#fff',
              }}
            />
          </Mapbox.ShapeSource>
          <SelectedPolygon />
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
