import React, { useState } from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import {
  PasswordInput,
  UsernameInput,
  EmailInput,
  GoogleSignButton,
} from "../../components";
import { NavLink } from "react-router-dom";
import { RegisterParams, resgiter } from "../../services";
import { SubmitHandler, useForm } from "react-hook-form";

const initialFormState: RegisterParams = {
  email: "",
  username: "",
  password: "",
  password_confirmation: "",
};

export const RegisterPage: React.FC = () => {
  // const [form, setForm] = useState<RegisterParams>(initialFormState);
  const { control, handleSubmit } = useForm<RegisterParams>();

  const onSubmit: SubmitHandler<RegisterParams> = async (data) => {
    console.log(data);
    await resgiter(data);
  };

  return (
    <AuthLayout>
      <Container>
        <Typography align="center" variant="h5">
          Register
        </Typography>
        <Typography
          align="center"
          variant="subtitle1"
          color={"gray"}
          gutterBottom
        >
          Get your Chat App account now.
        </Typography>
      </Container>
      <Container
        sx={{ backgroundColor: "#fff", padding: 3, boxShadow: 4 }}
        maxWidth="xs"
      >
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput control={control} name="email" />
            <UsernameInput control={control} name="username" />
            <PasswordInput control={control} name="password" />
            <PasswordInput
              control={control}
              name="password_confirmation"
              label="Password Confirmation *"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1.5 }}
              type="submit"
            >
              Register
            </Button>
          </form>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Already have an account? <NavLink to="/login">Login</NavLink>
          </Typography>
        </Container>
        <Divider sx={{ mx: 4 }}>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Or
          </Typography>
        </Divider>
        <Container>
          <GoogleSignButton />
        </Container>
      </Container>
    </AuthLayout>
  );
};

export default RegisterPage;
