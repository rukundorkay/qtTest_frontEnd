"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { API_URL } from "../../config/utils";
import { registerValidator } from "../../config/validators";

export default function Register() {
  // const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "",
    },
    validationSchema: registerValidator,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await API.post(`${API_URL}auth/register/`, values);
        toast({
          title: "Login success",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      } catch (err) {
        let errorMessages = [];
        if (err.response && err.response.data) {
          const errorData = err.response.data;
          for (const key in errorData) {
            if (Object.hasOwnProperty.call(errorData, key)) {
              const errorMessagesForKey = errorData[key];
              errorMessages = errorMessages.concat(errorMessagesForKey);
            }
          }
        }
        toast({
          title: "Error Occurred",
          description: (
            <ul>
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          ),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Flex
    minH={"100vh"}
    align={"center"}
    justify={"center"}
    bg={useColorModeValue("gray.50", "gray.800")}
  >
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"xs"}
        p={8}
      >
        <Heading fontSize={"2xl"} textAlign="center">
          Sign up for an account
        </Heading>
        <form onSubmit={formik.handleSubmit} className="mt-10">
          <Stack spacing={4}>
            <Flex gap={4}>
              <FormControl id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500">{formik.errors.firstName}</p>
                )}
              </FormControl>
              <FormControl id="lastName">
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500">{formik.errors.lastName}</p>
                )}
              </FormControl>
            </Flex>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500">{formik.errors.email}</p>
              )}
            </FormControl>

            <FormControl id="firstName" isRequired>
                <FormLabel>Telephone number</FormLabel>
                <Input
                  type="text"
                  name="phone_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone_number}
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <p className="text-red-500">{formik.errors.phone_number}</p>
                )}
              </FormControl>

            <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Select gender"
                  name="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500">{formik.errors.gender}</p>
                )}
              </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500">{formik.errors.password}</p>
              )}
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                isLoading={formik.isSubmitting}
                loadingText="Signing up"
                isDisabled={!formik.isValid || formik.isSubmitting}
                _hover={{
                  bg: "blue.500",
                }}
              >
                {formik.isSubmitting ? (
                  <Spinner size="sm" color="white" mr="2" />
                ) : (
                  <>Sign up</>
                )}
              </Button>
            </Stack>
          </Stack>
        </form>
        <Stack pt={6}>
          <Text textAlign="center">
            Already have an account?{" "}
            <Link  to={"/"} className="text-blue-400">
              Login
            </Link>
          </Text>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  );
}
