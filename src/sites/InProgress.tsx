/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NativeModules} from 'react-native';
import SiteCard from '../components/SiteCard';

enum GeometryMetricTypeEnum {
  AREA = 'AREA',
}

enum GeometryMetricUnitEnum {
  HECTARE = 'HECTARE',
}

enum SiteStatusEnum {
  IN_PROGRESS = 'IN PROGRESS',
  NEW = 'NEW',
  COMPLETED = 'COMPLETED',
}

export type TSiteData = {
  id: string;
  areaHabitatBiodiversityUnit: number;
  hedgerowHabitatBiodiversityUnit: number;
  watercourseHabitatBiodiversityUnit: number;
  assignedOnDate: string;
  opportunity: number;
  siteClassification: string;
  habitatsAssessmentCount: {assessed: number; total: number};
  siteName: string;
  sitePostCode: string;
  siteRegion: string;
  shape: GeoJSON.Polygon;
  centroid: GeoJSON.Point;
  groundSurveyStatus: {code: SiteStatusEnum; label: string};
  geometryMetric: {
    geometryMetricType: GeometryMetricTypeEnum;
    unit: GeometryMetricUnitEnum;
    value?: number;
  };
};

function InProgress({navigation}): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [siteData, setSiteData] = useState<TSiteData[]>([]);

  const getData = async () => {
    console.log(NativeModules);
    const HobexModule = NativeModules.RNSiteModule;

    const data = await HobexModule.getSiteDetails(
      '"statusTitle":"In-Progress"',
    );
    console.log('db Data', data);
    if (typeof data === 'object') {
      const siteArr = Object.values(data) as TSiteData[];
      setSiteData(siteArr);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const siteListRenderItem = ({item}: {item: TSiteData}) => {
    return <SiteCard {...item} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={[backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={siteListRenderItem}
          data={siteData}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  list: {
    flexGrow: 1,
    width: '100%',
  },
  listContent: {
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flexGrow: 1,
    width: '100%',
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
