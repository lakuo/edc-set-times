export interface DJSet {
    dj_name: string;
    stage: string;
    day: string;
    start_time: string; // "07:00 PM"
    end_time: string;   // "08:00 PM"
}

export interface DayTabProps {
    filteredSets: DJSet[];
    isSetOngoing: (set: DJSet) => boolean;
    calculateTimeLeft: (endTime: string, currentTime: number) => number;
    selectedTime: number;
    handleCurrentTimeClick: () => void;
    handleSliderChange: (value: number) => void;
    getTimeLabel: (time: number) => string;
}
