/* eslint-disable react/prop-types */
import {
  Box,
  Text,
  Flex,
  Badge,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { Trash } from "react-feather";
import ConfirmModal from "./confirmModal";

export const TaskCard = ({ task, onDelete }) => {
  const { name, description, assignees, start_date, end_date, id } = task;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    onOpen();
  };

  const handleConfirmDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} bg={"white"}>
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        mb={2}
        mt={4}
      >
        <Text fontSize="xl" className="capitalize" fontWeight="bold" mb={2}>
          {name}
        </Text>

        <Button variant="ghost" onClick={handleDelete} colorScheme="red">
          <Trash size={18} />
        </Button>
      </Flex>
      <Text mb={2} mt={4}>
        {description}
      </Text>
      <Flex direction="row" align="center" mb={2} mt={4}>
        <Text fontWeight="bold">Assignees: </Text>
        <Badge>{assignees?.join(", ")}</Badge>
      </Flex>
      <Flex direction="row" justify="space-between" mt={5}>
        <Text>
          <strong>Start Date:</strong> {start_date}
        </Text>
        <Text>
          <strong>End Date:</strong> {end_date}
        </Text>
      </Flex>

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        taskId={id}
      />
    </Box>
  );
};
