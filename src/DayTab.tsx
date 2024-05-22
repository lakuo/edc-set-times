import { Box, VStack, Text, Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { DayTabProps } from './types';

const DayTab: React.FC<DayTabProps> = ({
    filteredSets,
    isSetOngoing,
    calculateTimeLeft,
    selectedTime,
    handleCurrentTimeClick,
    handleSliderChange,
    getTimeLabel
}) => {
    return (
        <VStack spacing={4} position="relative">
            <Box overflowY="scroll" maxHeight="calc(100vh - 200px)" pr="4" width="100%">
                {filteredSets.filter(isSetOngoing).map(set => (
                    <Box key={set.dj_name} mt={0.5}>
                        <Text fontSize="lg">
                            <strong>{set.stage}</strong><br />{set.dj_name}
                            {isSetOngoing(set) ? ` (${calculateTimeLeft(set.end_time, selectedTime)} min left)` : ''}
                        </Text>
                    </Box>
                ))}
            </Box>
            <Box position="fixed" bottom="10px" width="90%" mx="auto">
                <Button colorScheme="teal" onClick={handleCurrentTimeClick}>Go to Current Time</Button>
                <Slider value={selectedTime} onChange={handleSliderChange} min={0} max={630} step={1}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                        <Box color="tomato" />
                    </SliderThumb>
                </Slider>
                <Text>Selected Time: {getTimeLabel(selectedTime)}</Text>
            </Box>
        </VStack>
    );
};

export default DayTab;