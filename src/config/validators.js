import * as yup from 'yup';

export const loginValidator = yup.object().shape({
  username: yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const forgotValidator = yup.object().shape({
  email: yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const taskSchema = yup.object().shape({
  name: yup.string().required("Task Name is required"),
  project_name: yup.string().required("Project is required"),
  end_date: yup
  .date()
  .required("Start Date is required")
  .test({
    name: "end_dateAfterstart_date",
    message: "End Date must be greater than Start Date",
    test: function (end_date) {
      const { start_date } = this.parent;
      return !start_date || !end_date || new Date(end_date) > new Date(start_date);
    },
  }),
  start_date: yup.date().required("Start Date is required"),
  assignees: yup.array().min(1, "At least one assignee is required"),
  description: yup.string().max(100).required("Description is required"),
  file_attachment: yup.mixed().required("File is required"),
});

export const registerValidator = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last name required"),
  gender: yup.string().required("Gender is required"),
  phone_number: yup.string().required("Telephone is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});
