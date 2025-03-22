import React from "react";
import { Button, Table } from "react-bootstrap";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = (props) => {
  const handleCopyToken = () => {
    navigator.clipboard.writeText(props.graphData.accessToken);
  };
  return (
    <div className="p-2">
      <Table striped bordered hover>
        <thead />
        <tbody>
          <tr>
            <td>Id</td>
            <td>{props.graphData.id}</td>
            <td />
          </tr>
          <tr>
            <td>First Name</td>
            <td>{props.graphData.givenName}</td>
            <td />
          </tr>
          <tr>
            <td>Last Name</td>
            <td>{props.graphData.surname}</td>
            <td />
          </tr>
          <tr>
            <td>Email</td>
            <td>{props.graphData.userPrincipalName}</td>
            <td />
          </tr>
          <tr>
            <td>Token expires in</td>
            <td>{String(props.graphData.expiresOn)}</td>
            <td />
          </tr>
          <tr>
            <td>Access token</td>
            <td className="flex-wrap truncate">
              {props.graphData.accessToken}
            </td>
            <td className="action">
              <Button onClick={handleCopyToken} variant="success" size="sm">
                Copy
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* <div id="profile-div">
        <p>
          <strong>First Name </strong> {props.graphData.givenName}
        </p>
        <p>
          <strong>Last Name </strong> {props.graphData.surname}
        </p>
        <p>
          <strong>Email </strong> {props.graphData.userPrincipalName}
        </p>
        <p>
          <strong>Id </strong> {props.graphData.id}
        </p>
        <br />
        <p>
          <strong>Expires in </strong> {String(props.graphData.expiresOn)}
        </p>
        <p>
          <strong>Access Token </strong> {props.graphData.accessToken}
        </p>
      </div> */}
    </div>
  );
};
