import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  theme,
  Button,
  Heading,
  HStack,
  IconButton,
  Center,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FaTwitter, FaCog, FaWrench } from "react-icons/fa";
import useStickyState from "./useStickyState";
import { SourcesModal } from "./SourcesModal";

interface InsultFile {
  intros: string[];
  insults: string[];
  oneoffs: string[];
}

const makeInsult = (insults: any) => {
  const getInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

  const a = getInt(insults.intros.length),
    b = getInt(insults.insults.length),
    c = getInt(insults.oneoffs.length),
    d = getInt(3);

  if (d <= 1) {
    return `@tedcruz ${insults.intros[a]} ${insults.insults[b]}`;
  } else {
    return `@tedcruz ${insults.oneoffs[c]}`;
  }
};

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [insult, setInsult] = useState("");
  const [insults, setInsults] = useState<InsultFile | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sources, setSources] = useStickyState(
    ["./main.json"],
    "insultSources"
  );

  useEffect(() => {
    Promise.allSettled(
      sources.map((url: string) => fetch(url).then((x) => x.json()))
    )
      .then((res) => {
        const insultSources = res.map(
          (c) => c.status === "fulfilled" && c.value
        );
        const ins = insultSources.reduce<InsultFile>(
          (acc, cur) => ({
            intros: [...acc.intros, ...cur.intros],
            insults: [...acc.insults, ...cur.insults],
            oneoffs: [...acc.oneoffs, ...cur.oneoffs],
          }),
          {
            intros: [],
            insults: [],
            oneoffs: [],
          }
        );
        setInsults(ins);
        setInsult(makeInsult(ins));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setInsult(
          "Wrong configuration. Try editing settings from the top right."
        );
      });
  }, [sources]);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <HStack justifyContent="flex-end" m={2}>
          <ColorModeSwitcher />
          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="current"
            marginLeft="2"
            onClick={onOpen}
            icon={<FaWrench />}
            aria-label={`Settings`}
          />
        </HStack>
        <Center minH="80vh" p={3}>
          <VStack spacing={8}>
            <VStack spacing={0}>
              <Heading size="md">Ted Cruz Tweet Generator</Heading>
              <Text>Tell him what you think of him, with 0 effort!</Text>
            </VStack>

            {isLoading ? (
              <HStack spacing={3}>
                <Spinner />
                <Heading size="lg">Loading...</Heading>
              </HStack>
            ) : (
              <>
                <HStack>
                  <Button
                    onClick={() => {
                      setInsult(makeInsult(insults));
                    }}
                    leftIcon={<FaCog />}
                    colorScheme="blue"
                  >
                    Generate
                  </Button>

                  <Button
                    as="a"
                    href={`https://twitter.com/intent/tweet?text=${encodeURI(
                      insult
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<FaTwitter />}
                    colorScheme="blue"
                  >
                    Tweet
                  </Button>
                </HStack>

                <Heading size="lg">{insult}</Heading>
              </>
            )}
          </VStack>
        </Center>
      </Box>

      <SourcesModal
        isOpen={isOpen}
        onClose={onClose}
        sources={sources}
        setSources={setSources}
      />
    </ChakraProvider>
  );
};
