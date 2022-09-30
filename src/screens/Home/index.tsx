/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {
  AuthorizationPermissions,
  HealthKitDataType,
  GoogleFitDataType,
  FitnessTracker,
  FitnessDataType,
} from '@kilohealth/rn-fitness-tracker';

import {colors, fontFamily, fontSizes} from '../../theme';
import {BottomSheet, Header} from '../../components/common';
import {
  isValidAddress,
  mtoFtIn,
  mtoKm,
  toURLString,
  truncateAddress,
  wait,
} from '../../utils';
import {PasscodeBottomSheet, Stat} from '../../components';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  getIsAuthorized,
  setIsAuthorize,
} from '../../redux/reducers/fitnessTracker';
import {getFullName} from '../../redux/reducers/profile';
import {Placeholder} from '../../assets/images';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  createHBTAction,
  getBase58Address,
  getHBTs,
  getHBTsAction,
  getSBT,
} from '../../redux/reducers/wallet';
import {PublicKey} from '@solana/web3.js';
import _ from 'lodash';
import SimpleToast from 'react-native-simple-toast';

type Date = {
  stepsToday: number;
  distanceToday: number;
  latestWeight: number;
  latestHeight: number;
};

const Home = () => {
  const passcodeBottomSheetRef = useRef<RBSheet>();
  const hbtsBottomSheetRef = useRef<RBSheet[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setDate] = useState<Date>();
  const dispatch = useAppDispatch();
  const isAppAuthorized = useAppSelector(getIsAuthorized);
  const fullName = useAppSelector(getFullName);
  const address = useAppSelector(getBase58Address);
  const HBTs = useAppSelector(getHBTs);
  const SBT = useAppSelector(getSBT);
  const [isClaimDisabled, setIsClaimDisabled] = useState(true);

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
      dispatch(getHBTsAction(new PublicKey(address)));
    })();
  }, [refreshing, isAppAuthorized]);
  const getStepsToday = async () => {
    if (!isAppAuthorized) {
      const authorized = await FitnessTracker.authorize(permissions);
      console.log('Authorized? ', authorized);
      if (!authorized) {
        return;
      }
      dispatch(setIsAuthorize({isAuthorized: authorized}));
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
    if (!SBT) {
      setIsClaimDisabled(true);
      console.log('Claim Disabled');
    } else if (stepsToday > 0 && distanceToday > 0) {
      setIsClaimDisabled(false);
      console.log('Claim Enabled');
    } else {
      setIsClaimDisabled(true);
      console.log('Claim Disabled');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <>
        <FlatList
          style={{
            paddingHorizontal: scale(16),
          }}
          contentContainerStyle={{
            paddingBottom: scale(40),
          }}
          refreshControl={
            <RefreshControl
              tintColor="#EEE"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={HBTs}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.title}>Today's Stats</Text>
              <View style={styles.stats}>
                <Stat
                  label="Steps"
                  value={data?.stepsToday ? data?.stepsToday : 0}
                />
                <Stat
                  label="Distance"
                  value={`${mtoKm(data?.distanceToday)} km`}
                />
              </View>
              <Text style={styles.title}>Unclaimed HBTs</Text>
              <View style={styles.hbtView}>
                <Image
                  style={styles.hbtImage}
                  defaultSource={Placeholder}
                  source={{
                    uri: `https://saicharanpogul.xyz/api/healthbound/hbt?steps=${
                      data?.stepsToday ? data?.stepsToday : 0
                    }&distance=${mtoKm(data?.distanceToday)}&name=${toURLString(
                      fullName,
                    )}&date=${new Date().getTime()}&face=front&filetype=png`,
                  }}
                />
                <TouchableOpacity
                  activeOpacity={isClaimDisabled ? 1 : 0.2}
                  onPress={
                    isClaimDisabled
                      ? () => {}
                      : () => passcodeBottomSheetRef.current?.open()
                  }
                  style={[
                    styles.claimButton,
                    isClaimDisabled ? styles.disabledClaimButton : {},
                  ]}>
                  <Text style={styles.claimButtonText}>Claim</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>Claimed HBTs</Text>
            </>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.info}>No claimed HBTs</Text>
          )}
          keyExtractor={(item, index) => (item.offChain.name as string) + index}
          renderItem={({item: HBT, index}) => (
            <BottomSheet
              ref={ref => (hbtsBottomSheetRef.current[index] = ref)}
              onPress={() => hbtsBottomSheetRef.current[index]?.open()}
              height={240}>
              <Image
                defaultSource={Placeholder}
                style={styles.hbtsImage}
                source={{uri: HBT.offChain.image as string}}
              />
              <View>
                <Text style={styles.metadataTitle}>Metadata</Text>
                {HBT.offChain.attributes?.map(attribute => (
                  <View key={attribute.trait_type} style={styles.attributes}>
                    <Text style={styles.traitType}>
                      {_.capitalize(attribute.trait_type)}
                    </Text>
                    <Text style={styles.traitValue}>
                      {isValidAddress(attribute.value as string)
                        ? truncateAddress(attribute.value as string)
                        : attribute.value}
                    </Text>
                  </View>
                ))}
              </View>
            </BottomSheet>
          )}
        />
      </>
      <PasscodeBottomSheet
        ref={passcodeBottomSheetRef}
        onSubmit={_data => {
          dispatch(
            createHBTAction({
              fullName,
              steps: Number(data?.stepsToday),
              distance: mtoKm(data?.distanceToday),
              date: new Date().getTime(),
              passcode: _data.passcode,
              callback: () => {
                passcodeBottomSheetRef.current?.close();
                wait(1000).then(() => {
                  SimpleToast.show('Successfully minted HBT! 🎉');
                });
              },
            }),
          );
        }}
        title="Claim Today's HBT"
      />
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
    flexDirection: 'row',
    marginTop: '10@s',
    justifyContent: 'space-around',
  },
  title: {
    color: colors.primary.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    marginTop: '16@s',
  },
  hbtView: {
    borderWidth: '1@s',
    paddingVertical: '16@s',
    borderColor: colors.text.main,
    borderRadius: '10@s',
    marginTop: '16@s',
  },
  hbtImage: {
    width: '250@s',
    height: '250@s',
    borderRadius: '4@s',
    alignSelf: 'center',
  },
  claimButton: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '16@s',
    backgroundColor: colors.text.main,
    width: '250@s',
    padding: '10@s',
    borderRadius: '4@s',
  },
  disabledClaimButton: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '16@s',
    backgroundColor: colors.text.light,
    width: '250@s',
    padding: '10@s',
    borderRadius: '4@s',
  },
  claimButtonText: {
    color: colors.primary.dark,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
  },
  info: {
    color: colors.text.light,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    marginTop: '10@s',
    textAlign: 'center',
  },
  hbtsImage: {
    width: '250@s',
    height: '250@s',
    borderRadius: '4@s',
    alignSelf: 'center',
    marginTop: '16@s',
  },
  metadataTitle: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    textAlign: 'center',
    marginTop: '8@s',
  },
  attributes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '16@s',
  },
  traitType: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
  },
  traitValue: {
    color: colors.primary.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
  },
});
