"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { API_URL } from "../../config/utils";
import { loginValidator } from "../../config/validators";
import Cookies from "js-cookie";

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      try {
        loginValidator.validateSync(values, { abortEarly: false });
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
        const res = await API.post(`${API_URL}auth/login/`, values);
        console.log(res.data)
        Cookies.set("token", res?.data?.data.token);
        Cookies.set("user",JSON.stringify(res?.data?.data.user));
        toast({
          title: "Login success",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/dashboard/task");
        console.log(res);
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
        {/* <Stack align={'left'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
        
        </Stack> */}
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
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className=" text-red-500">{formik.errors.username}</p>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className=" text-red-500">{formik.errors.password}</p>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link className="text-blue-400" to={"/register"}>
                    Create an account
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  size="lg"
                  isLoading={formik.isSubmitting}
                  loadingText="Logging you in"
                  isDisabled={!formik.isValid || formik.isSubmitting}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  {formik.isSubmitting ? (
                    <Spinner size="sm" color="white" mr="2" />
                  ) : (
                    <>Sign in</>
                  )}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
