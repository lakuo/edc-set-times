import React, { useState, ReactNode } from 'react';
import { IconButton, Box, Text } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface CollapsibleMenuProps {
  children: ReactNode;
}

const CollapsibleMenu: React.FC<CollapsibleMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="fixed" bottom="0" right="40px" zIndex="10">
      <IconButton
        aria-label={isOpen ? 'Hide stages' : 'Show stages'}
        icon={isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
        onClick={() => setIsOpen(!isOpen)}
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        marginRight={5}
        position="fixed"
        bottom={0}
        right={5}
      />
      {isOpen && (
        <Box
          position="absolute"
          bottom="50px"
          right="0"
          width="300px"
          boxShadow="md"
          p="0"
          bgColor="gray"
          borderRadius="md"
        >
          {children}
          <Text size="sm" >
            Drag to Rearrange Stage Order!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CollapsibleMenu;
