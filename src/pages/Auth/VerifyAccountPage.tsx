import React from "react";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { verifyAccount } from "../../services";

export const verifyAccountLoader = async ({
  params,
}: LoaderFunctionArgs<any>) => {
  if (!params.emailToken) {
    throw new Response("No token provided", { status: 400 });
  }
  try {
    await verifyAccount({ emailToken: params.emailToken });
    return redirect("/login");
  } catch (error) {
    throw new Response("Verification failed", { status: 500 });
  }
};

export const VerifyAccountPage = () => {
  return <div>Verifying...</div>;
};

export default VerifyAccountPage;
