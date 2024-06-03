import React, { useEffect } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { VerifyEmailResponse, verifyAccount } from "../../services";

export const verifyAccountLoader = async ({
  params,
}: LoaderFunctionArgs<any>) => {
  if (!params.emailToken) {
    throw new Response("No token provided", { status: 400 });
  }
  try {
    const response = await verifyAccount({ emailToken: params.emailToken });
    return response;
  } catch (error) {
    throw new Response("Verification failed", { status: 500 });
  }
};

export const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const response = useLoaderData() as VerifyEmailResponse;

  useEffect(() => {
    if (response) {
      navigate("/login", {
        state: {
          isActiveEmail: response.data.verificationStatus,
          email: response.data.email,
        },
        replace: true,
      });
    }
  }, [response, navigate]);

  return <div>Verifying...</div>;
};

export default VerifyAccountPage;
