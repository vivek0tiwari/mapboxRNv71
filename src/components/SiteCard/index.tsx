import React, {FC, useEffect, useMemo, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {TSiteData} from '../../sites/InProgress';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {point as turfPoint, distance as turfDistance} from '@turf/turf';
const DEVICE_WIDTH = Dimensions.get('screen').width;
const SiteCard: FC<TSiteData & {navigation?: any}> = props => {
  const {
    siteName,
    areaHabitatBiodiversityUnit,
    hedgerowHabitatBiodiversityUnit,
    watercourseHabitatBiodiversityUnit,
    geometryMetric,
    sitePostCode,
    siteRegion,
    habitatsAssessmentCount,
    groundSurveyStatus,
    navigation,
    centroid,
    id,
  } = props;

  const [currentUserLocation, setCurrentUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(res => {
        console.log('res', res);
        if (res === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              setCurrentUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            error => {
              console.log('errorLocation', error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, []);

  const distance = useMemo(() => {
    const from = turfPoint([currentUserLocation.lng, currentUserLocation.lat]);
    const to = turfPoint(centroid.coordinates);
    const dis = turfDistance(to, from, {units: 'miles'});
    return dis.toFixed(2);
  }, [centroid, currentUserLocation]);

  const gotoSiteMap = () => {
    navigation.navigate('SiteMap', {
      siteName: siteName,
      siteId: id,
    });
  };

  return (
    <Pressable onPress={gotoSiteMap}>
      <View style={styles.container}>
        <View style={styles.siteNameContainer}>
          <View>
            <Text style={styles.siteNameLabel}>Site Name</Text>
            <Text style={[styles.siteName]}>{siteName}</Text>
            <Text style={styles.areaLabel}>
              AREA: {Number(geometryMetric?.value).toFixed(2)} Ha
            </Text>
            <Text style={styles.areaLabel}>
              {sitePostCode}, {siteRegion}
            </Text>
          </View>
          <View>
            <Text>{distance} Miles</Text>
          </View>
        </View>
        <View style={styles.bidContainer}>
          <View style={styles.bidUnit}>
            <Text>Area Habitat Biodiversity Units</Text>
            <Text style={styles.boldText}>
              {Number(areaHabitatBiodiversityUnit).toFixed(2)}
            </Text>
          </View>
          <View style={styles.bidUnit}>
            <Text>Hedgerow Habitat Biodiversity Units</Text>
            <Text style={styles.boldText}>
              {Number(hedgerowHabitatBiodiversityUnit).toFixed(2)}
            </Text>
          </View>
          <View style={styles.bidUnit}>
            <Text>Watercourse Habitat Biodiversity Units</Text>
            <Text style={styles.boldText}>
              {Number(watercourseHabitatBiodiversityUnit).toFixed(2)}
            </Text>
          </View>
          <View style={styles.bidUnit}>
            <Text>Habitat Assessed</Text>
            <Text style={styles.boldText}>
              {habitatsAssessmentCount.assessed}/{habitatsAssessmentCount.total}
            </Text>
          </View>
          <View style={styles.bidUnit}>
            <Text>Status</Text>
            <Text style={styles.boldText}>{groundSurveyStatus.label}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 0.9 * DEVICE_WIDTH,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  siteNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bidContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  siteNameLabel: {
    fontSize: 10,
    color: 'grey',
  },
  areaLabel: {
    fontSize: 12,
  },
  bidUnit: {
    width: '50%',
    marginVertical: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
    marginTop: 4,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
});

export default SiteCard;
