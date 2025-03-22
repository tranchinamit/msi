import React, { useMemo, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { graphConfig, loginRequest } from "../../authConfig";
import { callMsGraph, getFileFromMsGraph } from "../../graph";
import { Button, Table } from "react-bootstrap";

const CurrentEmpCode = "nam.tranchi";

const Department_Emails = [
  "it@saigontechnology.com",
  "com@saigontechnology.com",
  "hr@saigontechnology.com",
  "hrinternal@saigontechnology.com",
  "manager.sdc@saigontechnology.com",
];

function removeVietnameseMarks(str) {
  return str
    .normalize("NFD") // Decomposes characters into base + diacritic
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
    .replace(/đ/g, "d") // Replace "đ" with "d"
    .replace(/Đ/g, "D") // Replace "Đ" with "D"
    .replaceAll(/\s/g, "_");
}

function hideFilename(filename) {
  const parts = filename.split(".");
  if (parts.length > 1) {
    return `***.${parts.pop()}`; // Keep only the extension
  }
  return "***"; // If no extension, just return ***
}

function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export default function SharedWithMe() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  console.log("💊 ~ accounts:", accounts);

  function requestSharedWithMe() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken, graphConfig.sharedWithMe()).then(
          (response) => {
            const cleanData = {
              ...response,
              value: response.value
                .map((item) =>
                  item.name.includes(CurrentEmpCode) ? null : item
                )
                .filter(Boolean),
            };

            console.log(JSON.stringify(cleanData));
            setGraphData(cleanData);
          }
        );
      });
  }

  function getFileByDriveIdAndFileId(data) {
    const driveId = data.remoteItem.parentReference.driveId;
    const remoteFileId = data.remoteItem.id;

    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        getFileFromMsGraph(
          response.accessToken,
          graphConfig.getFileByDriveIdAndFileId(driveId, remoteFileId)
        ).then(async (response) => {
          const blob = await response.blob();
          const fileURL = URL.createObjectURL(blob);

          const downloadLink = document.createElement("a");
          downloadLink.href = fileURL;
          downloadLink.download = data.name;
          document.body.appendChild(downloadLink);
          downloadLink.click();

          // window.open(fileURL);
          URL.revokeObjectURL(fileURL);
        });
      });
  }

  const filterFiles = useMemo(() => {
    if (!graphData) {
      return [[], []];
    }
    const Organization_Files = [];
    const Other_files = [];
    const arrayFiles = [];

    graphData.value.forEach((item) => {
      if (
        Department_Emails.includes(
          item.remoteItem.shared.sharedBy.user.email
        ) ||
        item.name.includes("HD-")
      ) {
        const driveId = item.remoteItem.parentReference.driveId;
        const remoteFileId = item.remoteItem.id;
        const fileName = removeVietnameseMarks(item.name);
        arrayFiles.push(`('${fileName}','${remoteFileId}','${driveId}')`);

        Organization_Files.push(item);
      } else {
        Other_files.push(item);
      }
    });

    console.log(arrayFiles.join(",\n"));
    return [Organization_Files, Other_files];
  }, [graphData]);

  const renderFiles = () => {
    return (
      <>
        <h4>Company Documents</h4>
        <Table striped bordered hover>
          <thead>
            <th>No.</th>
            <th>FileName</th>
            <th>Owner</th>
            <th></th>
          </thead>
          <tbody>
            {filterFiles?.[0]?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="text-left flex-wrap">{item.name}</td>
                <td className="owner">
                  {item.remoteItem.shared.sharedBy.user.displayName}
                </td>
                <td className="p-2 action">
                  <Button
                    onClick={() => getFileByDriveIdAndFileId(item)}
                    variant="success"
                    size="sm"
                  >
                    Download {formatFileSize(item.size)}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <br />
        <br />
        <br />
        <h4>Individual Documents</h4>
        <Table striped bordered hover>
          <thead>
            <th>No.</th>
            <th>FileName</th>
            <th>Owner</th>
            <th></th>
          </thead>
          <tbody>
            {filterFiles?.[1]?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="text-left flex-wrap">
                  {hideFilename(item.name)}
                </td>
                <td className="owner">
                  {item.remoteItem.shared.sharedBy.user.displayName}
                </td>
                <td className="p-2 action">
                  <Button
                    onClick={() => getFileByDriveIdAndFileId(item)}
                    variant="success"
                    size="sm"
                  >
                    Download {formatFileSize(item.size)}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <div>
      {graphData?.value ? (
        renderFiles()
      ) : (
        <Button variant="secondary" onClick={requestSharedWithMe}>
          Request Shared With Me
        </Button>
      )}

      {/* <Button variant="secondary" onClick={getFileByDriveIdAndFileId}>
        Get File By DriveId & FileId
      </Button>
      <br />
      <br /> */}
    </div>
  );
}
