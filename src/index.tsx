import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { Provider } from "react-redux";
import { store } from "./stores";
import { AuthProvider } from "./hooks";
import { DOCUMENT_TITLE } from "./constants";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

document.title = DOCUMENT_TITLE;

root.render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
