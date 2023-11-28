import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import NavBar from "../../components/navbar";
import { taskSchema } from "../../config/validators";
import { API_URL, token } from "../../config/utils";
import { API } from "../../config/api";
import { useEffect, useState } from "react";

const TaskerPage = () => {
  const [assignees, setAssignees] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const options = assignees.map((assignee) => ({
    value: assignee.id,
    label: assignee.name,
  }));

  const formik = useFormik({
    initialValues: {
      project_name: "",
      name: "",
      start_date: null,
      end_date: null,
      assignees: [],
      description: "",
      file_attachment: null,
    },
    validate: (values) => {
      try {
        taskSchema.validateSync(values, { abortEarly: false });
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
        const formData = new FormData();
        formData.append("project_name", values.project_name);
        formData.append("name", values.name);
        formData.append("start_date", values.start_date);
        formData.append("end_date", values.end_date);
        formData.append("assignees", JSON.stringify(values.assignees));
        formData.append("description", values.description);
        formData.append("file_attachment", "file_url");
        const res = await API.post(`${API_URL}task/`, formData, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log(res.data);
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

  const fetchAssignees = async () => {
    await API.get(`${API_URL}task/assignees`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        console.log(response);
        setAssignees(response?.data);
      })
      .catch((error) => {
        const {
          data: { metaData },
        } = error.response;
        console.log(metaData);
      });
  };

  useEffect(() => {
    fetchAssignees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NavBar />
      <div className="container pt-5 bg-gray-100 min-h-screen">
        <Box
          maxW="xl"
          mx="auto"
          mt={8}
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="xs"
          position="relative"
          bg={"white"}
        >
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Flex direction="column" gap={6}>
              <Flex direction="row" justify="right" align="right" gap={4}>
                <Link to={"/dashboard/task"}>
                  {" "}
                  <Button colorScheme="red" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={formik.isSubmitting}
                  loadingText="Saving task"
                >
                  {formik.isSubmitting ? (
                    <Spinner size="sm" color="white" mr="2" />
                  ) : (
                    <>Save Task</>
                  )}
                </Button>
              </Flex>
              <FormControl>
                <FormLabel>Task Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500">{formik.errors.name}</div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Project </FormLabel>
                <Input
                  type="text"
                  name="project_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.project_name}
                />
                {formik.touched.project_name && formik.errors.project_name && (
                  <div className="text-red-500">
                    {formik.errors.project_name}
                  </div>
                )}
              </FormControl>

              <Flex gap={2}>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.start_date}
                  />
                  {formik.touched.start_date && formik.errors.start_date && (
                    <div className="text-red-500">
                      {formik.errors.start_date}
                    </div>
                  )}
                </FormControl>
                <Spacer />
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.end_date}
                  />
                  {formik.touched.end_date && formik.errors.end_date && (
                    <div className="text-red-500">{formik.errors.end_date}</div>
                  )}
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>Assignees</FormLabel>
                <Select
                  options={options}
                  isMulti
                  name="assignees"
                  onChange={(selected) =>
                    formik.setFieldValue("assignees", selected)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.assignees}
                />
                {formik.touched.assignees && formik.errors.assignees && (
                  <div className="text-red-500">{formik.errors.assignees}</div>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />

                <div className="text-red-500">{formik.errors.description}</div>
              </FormControl>
              <FormControl>
                <FormLabel>File</FormLabel>
                <Input
                  type="file"
                  name="file_attachment"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "file_attachment",
                      event.currentTarget.files[0]
                    );
                  }}
                  onBlur={formik.handleBlur}
                  p={1}
                />
                {formik.touched.file_attachment &&
                  formik.errors.file_attachment && (
                    <div className="text-red-500">
                      {formik.errors.file_attachment}
                    </div>
                  )}
              </FormControl>
            </Flex>
          </form>
        </Box>
      </div>
    </>
  );
};

export default TaskerPage;
