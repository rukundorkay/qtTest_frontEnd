/* eslint-disable react/prop-types */
import {
    Box,
    Text,
 
  } from "@chakra-ui/react";
export const AnalyticsCard = ({ title, number }) => {
    return (
      <Box p={4} borderWidth={1} borderRadius="lg" bg="white" className="hover:bg-[#e78108] cursor-pointer hover:text-white">
        <Text fontSize="md" className="capitalize">
          {title}
        </Text>
        <Text fontSize="2xl" fontWeight={500}>
          {number}
        </Text>
        {/* <Link className="text-smartClass-blue text-xs text-bold">View More</Link> */}
      </Box>
    );
  };