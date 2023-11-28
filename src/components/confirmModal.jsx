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
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { API } from "../config/api";
import { API_URL, token } from "../config/utils";

const ConfirmModal = ({ isOpen, onClose, taskId }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const deleteTask = async () => {
    setLoading(true);
    await API.delete(`${API_URL}task/${taskId}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
        toast({
            title: "Task deleted",
            status: "success",
         
          });
        onClose()
        window.location.reload()
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
          <Button
            colorScheme="red" onClick={deleteTask}
            isLoading={loading}
            loadingText="Deleting task ..."
    
          >
            {loading ? (
              <Spinner size="sm" color="white" mr="2" />
            ) : (
              <> Yes, I am sure</>
            )}
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
