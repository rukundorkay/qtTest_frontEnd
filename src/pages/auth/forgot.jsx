"use client";

import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { API_URL } from "../../config/utils";
import { forgotValidator } from "../../config/validators";

export default function ForgotPage() {

  const toast = useToast();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    
    },
    validate: (values) => {
      try {
        forgotValidator.validateSync(values, { abortEarly: false });
      } catch (errors) {
        return errors.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await API.post(`${API_URL}auth/forgot-password/`, values);
        Cookies.set("email", values.email);
        toast({
          title: "Instructions sent",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/reset");
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
      <Stack align={'left'}>
          <Heading fontSize={'2xl'}>Forgot your account password ?</Heading>
        
        </Stack> 
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"xs"}
          p={8}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className=" text-red-500">{formik.errors.email}</p>
                )}
              </FormControl>

              <Stack spacing={10}>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  size="lg"
                  isLoading={formik.isSubmitting}
                  loadingText="Sending instructions"
                  isDisabled={!formik.isValid || formik.isSubmitting}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  {formik.isSubmitting ? (
                    <Spinner size="sm" color="white" mr="2" />
                  ) : (
                    <>Send instructions</>
                  )}
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text textAlign="center">
                  Back to{" "}
                  <Link to={"/"} className="text-blue-400">
                    login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
