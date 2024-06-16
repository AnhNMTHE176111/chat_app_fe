import React from "react";
import { useAuth } from "../../hooks";
import HomeLayout from "../../layouts/HomeLayout";

export const CallPage = () => {
  // const { user, dispatch } = useAuth();
  return (
    <HomeLayout>
      <div style={{ color: "red" }}>Hello video page</div>
    </HomeLayout>
  );
};

export default CallPage;
