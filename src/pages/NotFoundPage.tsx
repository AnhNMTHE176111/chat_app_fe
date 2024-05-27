import React from "react";
import { Container, Typography } from "@mui/material";
import { AuthLayout } from "../layouts";
import { useRouteError } from "react-router-dom";

interface ErrorAttributes {
  status: number;
  statusText: string;
  data: string;
  message: string
}

export function NotFoundPage() {
  const error = useRouteError() as ErrorAttributes;
  return (
    <AuthLayout>
      <Container maxWidth="xl">
        <Typography align="center" margin={4} variant="h2">
          We couldn't find the page you requested
        </Typography>
        <Typography align="center" margin={4} variant="h5">
          {error.data || error.message}
        </Typography>
        <Typography
          align="center"
          variant="subtitle1"
          color={"gray"}
          gutterBottom
        >
          (Error code: {error.status})
        </Typography>
      </Container>
    </AuthLayout>
  );
}

export default NotFoundPage;
