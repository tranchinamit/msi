/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <Navbar
        variant="dark"
        className="navbarStyle"
        style={{ backgroundColor: "teal" }}
      >
        <a className="navbar-brand" href="/">
          <span style={{ fontSize: 32 }}>0x1</span>{" "}
          <small>- Microsoft Identity Platform</small>
        </a>
        <div className="collapse navbar-collapse justify-content-end">
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </Navbar>
      <br />
      <h5>
        <center>
          Welcome to the Microsoft Authentication Library For Javascript - React
          Quickstart
        </center>
      </h5>
      <br />
      <br />
      {props.children}
    </>
  );
};
