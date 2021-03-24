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
  Code,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FaTimes,
  FaTrash,
  FaPlus,
  FaGithub,
  FaHtml5,
  FaTrashRestore,
} from "react-icons/fa";

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
          <VStack>
            <Text>
              You can add more external sources (in JSON format) to generate
              even more messages. For example: add{" "}
              <Code>cmp.neocities.org/ted.json</Code> Note that the more sources
              you add, the longer the page will load for.
            </Text>

            <Text>Current sources:</Text>
          </VStack>

          {sources.length === 0 ? (
            <VStack>
              <Text>You don't have any sources.</Text>
            </VStack>
          ) : (
            sources.map((source, index) => (
              <Flex
                px={10}
                justifyContent="space-between"
                alignItems="center"
                key={`Source-${index}`}
              >
                <Text>
                  {source.replace("https://thingproxy.freeboard.io/fetch/", "")}
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
            ))
          )}
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
                    const fixToAdd = (str: string) =>
                      !/^((http|https):\/\/)/.test(str)
                        ? `https://${str}`
                        : str;
                    fetch(
                      `https://thingproxy.freeboard.io/fetch/${fixToAdd(toAdd)}`
                    )
                      .then((res) =>
                        res.json().then((src) => {
                          if (!res.ok) throw new Error();
                          if (checkIfUsableSource(src)) {
                            setSources((cur) => [
                              ...cur,
                              `https://thingproxy.freeboard.io/fetch/${fixToAdd(
                                toAdd
                              )}`,
                            ]);
                          } else {
                            alert("Unusable source");
                          }
                        })
                      )
                      .catch((err) => {
                        alert("Wrong URL.");
                      });
                  });
                setIsTryingToFetch(false);

                setToAdd("");
              }}
            />
          </Flex>
          <VStack mt={5}>
            <Button
              colorScheme="red"
              leftIcon={<FaTrashRestore />}
              onClick={() => {
                setSources(["./main.json"]);
              }}
            >
              Reset defaults
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button as="a" href="/v1/index.html" leftIcon={<FaHtml5 />}>
              Version 1
            </Button>
            <Button
              as="a"
              href="https://github.com/x-t/ted-cruz-generator"
              leftIcon={<FaGithub />}
            >
              Source
            </Button>
            <Button onClick={onClose} color="red">
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
