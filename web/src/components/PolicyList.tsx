import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  VStack,
  Text,
  Flex,
  IconButton,
  useColorModeValue,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, Search2Icon } from "@chakra-ui/icons";
import { PolicyService } from "../services/policies";
import { CustomerPolicy } from "../models/customer-policy";
import { FUEL } from "../models/enumerations/fuel";
import { VEHICLESEGMENT } from "../models/enumerations/vehicle-segment";
import { Customer } from "../models/customer";
import { REGION } from "../models/enumerations/region";

export const PolicyList = () => {
  const [policies, setPolicies] = useState<CustomerPolicy[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const background = useColorModeValue("twitter.100", "twitter.500");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [editingPolicy, setEditingPolicy] = useState<CustomerPolicy>();
  const [values, setValues] = useState({
    premium: 0,
    vehicleSegment: VEHICLESEGMENT.A,
    fuel: FUEL.CNG,
    bodilyInjuryLiability: false,
    personalInjuryProtection: false,
    propertyDamageLiability: false,
    collision: false,
    comprehensive: false,
    region: REGION.North
  });
  const [isSaving, setIsSaving] = useState(false);

  const policyService = new PolicyService();

  useEffect(() => {
    setIsLoading(true);
    policyService
      .fetchPolicies(searchText, page, size)
      .then((success) => {
        setTotalCount(success.count);
        setPolicies(success.result);
        setIsLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "Something went wrong.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, []);

  useEffect(() => {
    search(searchText);
  }, [page, size]);

  const search = (val: string) => {
    setIsLoading(true);
    policyService
      .fetchPolicies(searchText, page, size)
      .then((success) => {
        setTotalCount(success.count);
        setPolicies(success.result);
        setIsLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "Something went wrong.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const textChanged = (event: any) => {
    setSearchText(event.target.value);
  };

  const enterPress = (event: any) => {
    if (event.keyCode === 13) {
      search(searchText);
    }
  };

  const firstPage = (event: any) => {
    setPage(0);
  };

  const previousPage = (event: any) => {
    setPage((prev) => prev - 1);
  };

  const nextPage = (event: any) => {
    setPage((prev) => prev + 1);
  };

  const lastPage = (event: any) => {
    const page = Math.ceil(totalCount / size) - 1;
    setPage(page);
  };

  const editPolicy = (policy: CustomerPolicy) => {
    setEditingPolicy(policy);
    setValues({
      bodilyInjuryLiability: policy.bodilyInjuryLiability!,
      collision: policy.collision!,
      comprehensive: policy.comprehensive!,
      fuel: policy.fuel!,
      personalInjuryProtection: policy.personalInjuryProtection!,
      propertyDamageLiability: policy.propertyDamageLiability!,
      premium: policy.premium!,
      vehicleSegment: policy.vehicleSegment!,
      region: policy.region!
    });
    onOpen();
  };

  const handlePremiumChange = (event: any) => {
    event.persist();
    if (Number(event.target.value) > 1_000_000) {
      toast({
        title: "Premium Invalid.",
        description: "Premium cannot be more than 1 million.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setValues((values) => ({
      ...values,
      premium: Number(event.target.value),
    }));
  };

  const handleFuelChange = (event: any) => {
    event.persist();

    setValues((values) => ({
      ...values,
      fuel: event.target.value,
    }));
  };

  const handleVehicleChange = (event: any) => {
    event.persist();

    setValues((values) => ({
      ...values,
      vehicleSegment: event.target.value,
    }));
  };

  const handleRegionChange = (event: any) => {
    event.persist();

    setValues((values) => ({
      ...values,
      region: event.target.value,
    }));
  };

  const handleBooleanChange = (event: any) => {
    event.persist();

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.checked,
    }));
  };

  const saveForm = () => {
    setIsSaving(true);
    const policy = new CustomerPolicy();
    policy.id = editingPolicy?.id;
    policy.customer = editingPolicy?.customer;
    policy.dateOfPurchase = editingPolicy?.dateOfPurchase;
    policy.premium = values.premium;
    policy.fuel = values.fuel;
    policy.vehicleSegment = values.vehicleSegment;
    policy.bodilyInjuryLiability = values.bodilyInjuryLiability;
    policy.personalInjuryProtection = values.personalInjuryProtection;
    policy.propertyDamageLiability = values.propertyDamageLiability;
    policy.collision = values.collision;
    policy.comprehensive = values.comprehensive;
    policy.region = values.region;

    policyService
      .updatePolicy(policy)
      .then((success) => {
        toast({
          title: "Update successful",
          description: "Policy updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsSaving(false);
        onClose();
        search(searchText);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "Something went wrong.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsSaving(false);
      });
  };

  return (
    <VStack justifySelf="flex-start" spacing={4} align="stretch">
      <Stack spacing={4} w="50vw">
        <InputGroup>
          <Input
            placeholder="Enter policy ID or customer ID"
            onChange={textChanged}
            onKeyUp={enterPress}
          />
          <InputRightElement children={<Search2Icon color="green.500" />} />
        </InputGroup>
      </Stack>
      <VStack spacing={4} w="50vw">
        {policies.map((policy) => (
          <Box
            w="100%"
            backgroundColor={background}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            pl={4}
            pr={4}
            pt={4}
            key={policy.id}
          >
            <Flex justifyContent="space-between">
              <Box>
                <Heading m="1" mb="1" textAlign="left" as="h5" size="sm">
                  Policy ID :{policy.id}
                </Heading>
                <Heading m="1" mb="1" textAlign="left" as="h5" size="sm">
                  Customer ID: {policy.customer?.id}
                </Heading>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    editPolicy(policy);
                  }}
                  colorScheme="blue"
                  aria-label="Edit this policy"
                  icon={<EditIcon color="Tomato.500" />}
                />
              </Box>
            </Flex>
            <Heading m="1" mb="1" textAlign="left" as="h5" size="sm">
              Premium: ${policy.premium}
            </Heading>
            <Text m="1" mb="1" fontSize="sm" textAlign="left">
              Date of purchase:{" "}
              {new Date(policy.dateOfPurchase!).toDateString()}
            </Text>
          </Box>
        ))}
      </VStack>
      <Flex justifyContent="space-around" pb={20}>
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          disabled={!isLoading && page === 0}
          onClick={firstPage}
          variant="outline"
        >
          First Page
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          disabled={!isLoading && page === 0}
          onClick={previousPage}
          variant="outline"
        >
          Previous Page
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          disabled={!isLoading && page === Math.ceil(totalCount / size) - 1}
          onClick={nextPage}
          variant="outline"
        >
          Next Page
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          disabled={!isLoading && page === Math.ceil(totalCount / size) - 1}
          onClick={lastPage}
          variant="outline"
        >
          Last Page
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Policy details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Premium</FormLabel>
              <Input
                onChange={handlePremiumChange}
                value={values.premium}
                placeholder="Premium"
                type="number"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Fuel</FormLabel>
              <Select
                value={values.fuel}
                onChange={handleFuelChange}
                placeholder="Select option"
              >
                <option value="CNG">CNG</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Vehicle segment</FormLabel>
              <Select
                value={values.vehicleSegment}
                onChange={handleVehicleChange}
                placeholder="Select option"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Region</FormLabel>
              <Select
                value={values.region}
                onChange={handleRegionChange}
                placeholder="Select option"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="East">East</option>
              </Select>
            </FormControl>
            <Checkbox
              isChecked={values.bodilyInjuryLiability}
              name="bodilyInjuryLiability"
              onChange={handleBooleanChange}
            >
              Bodily Injury Liability
            </Checkbox>
            <br />
            <Checkbox
              isChecked={values.personalInjuryProtection}
              name="personalInjuryProtection"
              onChange={handleBooleanChange}
            >
              Personal Injury Protection
            </Checkbox>
            <br />
            <Checkbox
              isChecked={values.propertyDamageLiability}
              name="propertyDamageLiability"
              onChange={handleBooleanChange}
            >
              Property Damage Liability
            </Checkbox>
            <br />
            <Checkbox
              isChecked={values.collision}
              name="collision"
              onChange={handleBooleanChange}
            >
              Collision
            </Checkbox>
            <br />
            <Checkbox
              isChecked={values.comprehensive}
              name="comprehensive"
              onChange={handleBooleanChange}
            >
              Comprehensive
            </Checkbox>
            <br />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              isLoading={isSaving}
              onClick={saveForm}
              mr={3}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
