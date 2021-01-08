import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  Flex,
  Heading,
  IconButton,
  ModalBody,
  HStack,
  Spinner,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaTimes, FaTrash, FaPlus } from "react-icons/fa";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: string[];
  setSources: React.Dispatch<React.SetStateAction<string[]>>;
}

const checkIfUsableSource = (source: any) => {
  try {
    if (
      Array.isArray(source.intros) &&
      Array.isArray(source.insults) &&
      Array.isArray(source.oneoffs)
    )
      return true;
    else return false;
  } catch {
    return false;
  }
};

export const SourcesModal = ({
  isOpen,
  onClose,
  sources,
  setSources,
}: SourcesModalProps) => {
  const [isTryingToFetch, setIsTryingToFetch] = useState(false);
  const [toAdd, setToAdd] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg">Settings</Heading>
            <IconButton
              variant="ghost"
              onClick={onClose}
              aria-label="Close"
              icon={<FaTimes />}
              p={0}
            />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Text>Current sources</Text>
          {sources.map((source, index) => (
            <Flex
              px={10}
              justifyContent="space-between"
              alignItems="center"
              key={`Source-${index}`}
            >
              <Text>
                {source.replace("https://cors-anywhere.herokuapp.com/", "")}
              </Text>
              <IconButton
                icon={<FaTrash />}
                aria-label={`Delete ${source}`}
                variant="outline"
                onClick={() => {
                  const newSrc = sources.slice();
                  newSrc.splice(index, 1);
                  setSources(newSrc);
                }}
              />
            </Flex>
          ))}
          {isTryingToFetch && (
            <HStack spacing={3}>
              <Spinner />
              <Heading size="md">Loading...</Heading>
            </HStack>
          )}
          <Flex px={10} justifyContent="space-between" alignItems="center">
            <Input
              value={toAdd}
              onChange={(event) =>
                setToAdd((event.target as HTMLInputElement).value)
              }
              placeholder="Add source..."
            />
            <IconButton
              variant="outline"
              icon={<FaPlus />}
              aria-label="Add source"
              onClick={() => {
                setIsTryingToFetch(true);
                fetch(toAdd)
                  .then((res) =>
                    res.json().then((src) => {
                      if (!res.ok) throw new Error();
                      if (checkIfUsableSource(src)) {
                        setSources((cur) => [...cur, toAdd]);
                      } else {
                        alert("Unusable source");
                      }
                    })
                  )
                  .catch((err) => {
                    fetch(`https://cors-anywhere.herokuapp.com/${toAdd}`)
                      .then((res) =>
                        res.json().then((src) => {
                          if (!res.ok) throw new Error();
                          if (checkIfUsableSource(src)) {
                            setSources((cur) => [
                              ...cur,
                              `https://cors-anywhere.herokuapp.com/${toAdd}`,
                            ]);
                          } else {
                            alert("Unusable source");
                          }
                        })
                      )
                      .catch((err) => {
                        alert("Wrong URL");
                      });
                  });
                setIsTryingToFetch(false);

                setToAdd("");
              }}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
