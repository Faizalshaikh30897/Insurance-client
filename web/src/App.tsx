import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Flex,
  theme,
  Heading,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { PolicyList } from "./components/PolicyList";
import {
  BrowserRouter,
  Route,
  Switch,
  Link as RouterLink,
  Redirect,
} from "react-router-dom";
import { Statistics } from "./components/Statistics";

export const App = () => {
  const background = useColorModeValue("orange.100", "tomato");
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <BrowserRouter>
          <Flex direction="column" minH="100vh">
            <Flex
              bgColor="orange.300"
              p={4}
              mb={8}
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Heading>Insurance Client</Heading>

              <Box ml={"auto"}>
                <Link
                  as={RouterLink}
                  mr={4}
                  to="/policies"
                  style={{ textDecoration: "none" }}
                >
                  <Button colorScheme="blue.500" variant="outline">
                    Policies
                  </Button>
                </Link>
                <Link
                  as={RouterLink}
                  to="/statistics"
                  style={{ textDecoration: "none" }}
                >
                  <Button colorScheme="blue.500" variant="outline">
                    Visualize
                  </Button>
                </Link>
                <ColorModeSwitcher />
              </Box>
            </Flex>

            <VStack spacing={8}>
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/policies" />
                </Route>
                <Route path="/policies">
                  <PolicyList></PolicyList>
                </Route>
                <Route path="/statistics">
                  <Statistics></Statistics>
                </Route>
              </Switch>
            </VStack>
          </Flex>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
};
