/* eslint-disable react-native/no-inline-styles */
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {
  AuthorizationPermissions,
  HealthKitDataType,
  GoogleFitDataType,
  FitnessTracker,
  FitnessDataType,
} from '@kilohealth/rn-fitness-tracker';

import {colors, fontFamily, fontSizes} from '../../theme';
import {Header} from '../../components/common';
import {mtoFtIn, mtoKm, wait} from '../../utils';
import {Stat} from '../../components';

type Date = {
  stepsToday: number;
  distanceToday: number;
  latestWeight: number;
  latestHeight: number;
};

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setDate] = useState<Date>();

  const permissions: AuthorizationPermissions = {
    healthReadPermissions: [
      HealthKitDataType.StepCount,
      HealthKitDataType.Height,
      HealthKitDataType.DistanceWalkingRunning,
      HealthKitDataType.BodyMass,
    ],
    googleFitReadPermissions: [
      GoogleFitDataType.Steps,
      GoogleFitDataType.Height,
      GoogleFitDataType.Weight,
      GoogleFitDataType.Distance,
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        await getStepsToday();
      } catch (error) {
        console.log(error);
      }
    })();
  }, [refreshing]);
  const getStepsToday = async () => {
    const authorized = await FitnessTracker.authorize(permissions);

    if (!authorized) {
      return;
    }

    const stepsToday = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );
    const latestWeight = await FitnessTracker.getLatestWeight();
    const latestHeight = await FitnessTracker.getLatestHeight();
    const distanceToday = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Distance,
    );

    setDate({
      stepsToday,
      distanceToday,
      latestHeight: Number(latestHeight),
      latestWeight: Number(latestWeight),
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#EEE"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {/* <Text style={styles.title}>Body Measurements</Text>
        <View style={styles.stats}>
          <Stat label="Height" value={mtoFtIn(data?.latestHeight)} />
          <Stat
            label="Weight"
            value={`${data?.latestWeight.toPrecision(2)} kg`}
          />
        </View> */}
        <Text style={styles.title}>Today's Stats</Text>
        <View style={styles.stats}>
          <Stat label="Steps" value={data?.stepsToday ? data?.stepsToday : 0} />
          <Stat label="Distance" value={`${mtoKm(data?.distanceToday)} km`} />
        </View>
        {/* <Text style={styles.title}>Calculated Stats*</Text>
        <View
          style={[
            styles.stats,
            {
              justifyContent: 'flex-start',
            },
          ]}>
          <Stat label="Calories" value={data?.stepsToday} />
        </View> */}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  stats: {
    marginHorizontal: '16@s',
    flexDirection: 'row',
    marginTop: '10@s',
    justifyContent: 'space-around',
  },
  title: {
    color: colors.primary.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    paddingHorizontal: '16@s',
    marginTop: '16@s',
  },
});
