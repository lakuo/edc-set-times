import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Button, Text, VStack, Heading,
  Center
} from "@chakra-ui/react"
import { DateTime } from 'luxon';
import { DJSet } from './types';
import scheduleData from './festival_schedule.json';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import DayTab from './DayTab';
import DraggableStages from './StageOrder';
import CollapsibleMenu from './CollapsibleMenu';
import DJSetCard from './DJBox';

export const App: React.FC = () => {

  const getInitialTime = () => {
    const now = DateTime.local();
    const festivalStartToday = DateTime.local().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });
    let minutesFromStart;
    if (now < festivalStartToday) {
      const festivalStartYesterday = festivalStartToday.minus({ days: 1 });
      return now.diff(festivalStartYesterday, 'minutes').minutes;
    } else {
      return now.diff(festivalStartToday, 'minutes').minutes;
    }
  };

  const [selectedTime, setSelectedTime] = useState<number>(getInitialTime());
  const [selectedDay, setSelectedDay] = useState<string>('Friday');
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const djSets: DJSet[] = scheduleData;

  useEffect(() => {
    setCurrentTime(DateTime.local());
  }, []);

  const handleSliderChange = (value: number) => {
    setSelectedTime(value);
  };

  const handleCurrentTimeClick = () => {
    const now = DateTime.local();
    const festivalStartToday = DateTime.local().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });
    let minutesFromStart;
    if (now < festivalStartToday) {
      const festivalStartYesterday = festivalStartToday.minus({ days: 1 });
      minutesFromStart = now.diff(festivalStartYesterday, 'minutes').minutes;
    } else {
      minutesFromStart = now.diff(festivalStartToday, 'minutes').minutes;
    }
    setSelectedTime(minutesFromStart);
  };

  const getTimeLabel = (value: number) => {
    const hours = Math.floor(value / 60) + 19;
    const actualHours = hours > 24 ? hours - 24 : hours;
    const minutes = value % 60;
    return DateTime.local().set({ hour: actualHours, minute: minutes }).toLocaleString(DateTime.TIME_SIMPLE);
  };

  const isSetOngoing = (set: DJSet) => {
    const today = DateTime.local();
    let start = DateTime.fromFormat(`${today.toFormat('yyyy-MM-dd')} ${set.start_time}`, 'yyyy-MM-dd h:mm a');
    let end = DateTime.fromFormat(`${today.toFormat('yyyy-MM-dd')} ${set.end_time}`, 'yyyy-MM-dd h:mm a');
    if (start.hour < 6) {
      start = start.plus({ days: 1 });
      end = end.hour < 6 ? end.plus({ days: 1 }) : end;
    }
    if (end <= start) {
      end = end.plus({ days: 1 });
    }
    const selectedDateTime = DateTime.local().set({
      hour: Math.floor(selectedTime / 60) + 19,
      minute: selectedTime % 60
    });
    return selectedDateTime >= start && selectedDateTime < end;
  };

  const calculateTimeLeft = (endTime: string, selectedTime: number): number => {
    const today = DateTime.local();
    let end = DateTime.fromFormat(`${today.toFormat('yyyy-MM-dd')} ${endTime}`, 'yyyy-MM-dd h:mm a');
    if (end.hour < 6) {
      end = end.plus({ days: 1 });
    }
    const selectedDateTime = DateTime.local().set({
      hour: Math.floor(selectedTime / 60) + 19,
      minute: selectedTime % 60
    });
    const diff = end.diff(selectedDateTime, 'minutes').toObject();
    return Math.max(0, Math.round(diff.minutes || 0));
  };

  const parseFestivalTime = (day: string, time: string): DateTime => {
    let dateTime = DateTime.fromFormat(`${day} ${time}`, 'EEEE hh:mm a');
    if (dateTime.hour < 6) {
      dateTime = dateTime.set({ day: dateTime.day + 1 });
    }
    return dateTime;
  };

  const festivalTimeComparator = (a: DJSet, b: DJSet): number => {
    const timeA = parseFestivalTime(a.day, a.start_time);
    const timeB = parseFestivalTime(b.day, b.start_time);
    return timeA.toMillis() - timeB.toMillis();
  };

  const findNextDJ = (currentSet: DJSet, sets: DJSet[]): DJSet | undefined => {
    const relevantSets = sets.filter(set => set.stage === currentSet.stage && set.day === currentSet.day);
    const sortedSets = relevantSets.sort(festivalTimeComparator);
    const currentSetIndex = sortedSets.findIndex(set => set.dj_name === currentSet.dj_name);
    return sortedSets[currentSetIndex + 1];
  };

  const defaultStages = ['Kinetic Field', 'Cosmic Meadow', 'Circuit Grounds', 'Neon Garden', 'Basspod', 'Wasteland', 'Quantum Valley', 'Stereobloom', 'House of Dunkin', 'Rynobus', 'Beatbox ArtCar', 'Bionic Jungle', 'Meta Phoenix', 'YeeDC!', 'Blacklight Bar'];
  const [stageOrder, setStageOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('stageOrder');
    return savedOrder ? JSON.parse(savedOrder) : defaultStages;
  });

  useEffect(() => {
    localStorage.setItem('selectedTime', selectedTime.toString());
    localStorage.setItem('selectedDay', selectedDay);
    localStorage.setItem('stageOrder', JSON.stringify(stageOrder));
  }, [selectedTime, selectedDay, stageOrder]);

  const orderedDJSets = djSets.sort((a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage));

  const filteredSets = orderedDJSets.filter(set => {
    const setStart = DateTime.fromFormat(`${set.day} ${set.start_time}`, 'EEEE hh:mm a');
    let setDayAdjusted = set.day;
    if (setStart.hour < 6 && setStart.hour >= 0) {
      setDayAdjusted = set.day;
    }
    return setDayAdjusted === selectedDay;
  });



  return (
    <Box width="80%" margin="0 auto" textAlign="center" mt={10}>
      <CollapsibleMenu>
        <DraggableStages stages={stageOrder} setStages={setStageOrder} />
      </CollapsibleMenu>
      <ColorModeSwitcher
        position="fixed"
        bottom="0px"
        right="0px"
      />
      <Tabs variant="soft-rounded" colorScheme="teal" onChange={(index) => setSelectedDay(['Friday', 'Saturday', 'Sunday'][index])}>
        <TabList justifyContent="center">
          <Tab>Friday</Tab>
          <Tab>Saturday</Tab>
          <Tab>Sunday</Tab>
        </TabList>
        <VStack spacing={4} position="relative">
          <Box overflowY="scroll" maxHeight="calc(100vh - 200px)" pr="4" width="100%">
            {filteredSets.filter(isSetOngoing).map(set => {
              const nextDJ = findNextDJ(set, filteredSets);
              return (
                <DJSetCard
                  set={set}
                  selectedTime={selectedTime}
                  nextDJ={nextDJ}
                  isSetOngoing={isSetOngoing}
                  calculateTimeLeft={calculateTimeLeft}
                />)
            })}

          </Box>
          <Box position="fixed" bottom="10px" width="90%" mx="auto">
            <Button colorScheme="teal" onClick={handleCurrentTimeClick}>Current</Button>
            <Slider value={selectedTime} onChange={handleSliderChange} min={0} max={630} step={1}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="tomato" />
              </SliderThumb>
            </Slider>
            <Text>{getTimeLabel(selectedTime)}</Text>
          </Box>
        </VStack>
        {/* <DayTab {...{
          filteredSets,
          isSetOngoing,
          calculateTimeLeft,
          selectedTime,
          handleCurrentTimeClick,
          handleSliderChange,
          getTimeLabel
        }} /> */}

      </Tabs>
    </Box >
  );
};

export default App;
