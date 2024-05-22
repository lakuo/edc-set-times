import React, { useState, useEffect } from 'react';
import { DJSet } from './types';
import { Box, Center, Text, IconButton, Flex } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { StarIcon } from '@chakra-ui/icons';

interface Props {
    set: DJSet;
    selectedTime: number;
    nextDJ?: DJSet;
    isSetOngoing: (set: DJSet) => boolean;
    calculateTimeLeft: (endTime: string, selectedTime: number) => number;
}
const DJBox: React.FC<Props> = ({
    set,
    selectedTime,
    nextDJ,
    isSetOngoing,
    calculateTimeLeft
}) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700')
    const [isStarred, setIsStarred] = useState<boolean>(false);
    const [isNextDJStarred, setIsNextDJStarred] = useState<boolean>(false);

    useEffect(() => {
        const starredDJs = JSON.parse(localStorage.getItem('starredDJs') || '[]') as string[];
        setIsStarred(starredDJs.includes(set.dj_name));
        if (nextDJ) {
            setIsNextDJStarred(starredDJs.includes(nextDJ.dj_name));
        }
    }, [set.dj_name, nextDJ]);


    useEffect(() => {
        const starredDJs = JSON.parse(localStorage.getItem('starredDJs') || '[]') as string[];
        setIsStarred(starredDJs.includes(set.dj_name));
    }, [set.dj_name]);

    const toggleStar = () => {
        const starredDJs = JSON.parse(localStorage.getItem('starredDJs') || '[]') as string[];
        if (starredDJs.includes(set.dj_name)) {
            const newStarredDJs = starredDJs.filter(djName => djName !== set.dj_name);
            localStorage.setItem('starredDJs', JSON.stringify(newStarredDJs));
            setIsStarred(false);
        } else {
            starredDJs.push(set.dj_name);
            localStorage.setItem('starredDJs', JSON.stringify(starredDJs));
            setIsStarred(true);
        }
    };

    let nextDJDuration: number | undefined = undefined;

    if (nextDJ) {
        const today = DateTime.local().toFormat('yyyy-MM-dd');
        let nextStartTime = DateTime.fromFormat(`${today} ${nextDJ.start_time}`, 'yyyy-MM-dd hh:mm a');
        let nextEndTime = DateTime.fromFormat(`${today} ${nextDJ.end_time}`, 'yyyy-MM-dd hh:mm a');

        if (nextEndTime <= nextStartTime) {
            nextEndTime = nextEndTime.plus({ days: 1 });
        }
        const duration = nextEndTime.diff(nextStartTime, 'minutes').minutes;
        nextDJDuration = Math.round(duration);
    }
    return (
        <Flex alignItems="center" justifyContent="space-between" mt={0.5} p="0.5" width="100%" bgColor={bgColor} borderRadius="md">
            <Box flexGrow={1}>
                <Text fontSize="lg" lineHeight={1.3}>
                    <strong>{set.stage}</strong><br />{set.dj_name}
                    {isSetOngoing(set) ? ` (${calculateTimeLeft(set.end_time, selectedTime)} min left)` : ''}
                </Text>
                {nextDJ && (
                    <Text fontSize="sm" color={isNextDJStarred ? "yellow.400" : "gray.500"}>
                        Next: {nextDJ.dj_name} ({nextDJDuration} min)
                    </Text>
                )}
            </Box>
            <IconButton
                aria-label="Star DJ"
                icon={<StarIcon />}
                color={isStarred ? "yellow.400" : "gray.300"}
                onClick={toggleStar}
                right={1}
                size="md"
            />
        </Flex>
    );
};
export default DJBox;