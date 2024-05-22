import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box } from '@chakra-ui/react';

export interface StageOrderProps {
    stages: string[];
    setStages: (stages: string[]) => void;
}

const DraggableStages: React.FC<StageOrderProps> = ({ stages, setStages }) => {
    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(stages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setStages(items);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef} p={2}>
                        {stages.map((stage, index) => (
                            <Draggable key={stage} draggableId={stage} index={index}>
                                {(provided) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        width=""
                                        my={0.5}
                                        bg="gray.500"
                                        borderRadius="sm"
                                        boxShadow="base"
                                        cursor="grab"
                                    >
                                        {stage}
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableStages;
