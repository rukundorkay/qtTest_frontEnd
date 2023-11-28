/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { API } from "../config/api";
import { API_URL, token } from "../config/utils";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const deleteTask = async () => {
    setLoading(true);
    await API.get(`${API_URL}task`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
     
      })
      .catch((error) => {
        setLoading(false);
        const {
          data: { metaData },
        } = error.response;
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: metaData.message[0],
        });
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this task?</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onConfirm}>
            Yes, I am sure
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
