import axios from "axios";
import { toast } from "react-toastify";

const loginCall = async (relativeUrl, payload) => {
  let result;
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("X-Frame-Options", "DENY");
    myHeaders.append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    const raw = JSON.stringify(payload);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      process.env.REACT_APP_SERVICE_URL + relativeUrl,
      requestOptions,
    );

    result = await response.json();

    if (Object.keys(result).length > 0 && result?.data?.result?.accessToken) {
      localStorage.setItem("token", JSON.stringify(result?.data?.result));
    }
    return result;
  } catch (error) {
    console.log("error", error);
    // toast.error(error)
    return error;
  }
};

const postCall = async (relativeUrl, payload) => {
  let response;
  try {
    // const token = JSON.parse(localStorage.getItem("token")).accessToken;
    // if (token === "undefined") {
    //   window.location.replace("/");
    // }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify(payload);
    // console.log('raw', raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    response = await fetch(
      import.meta.env.VITE_API_URL + relativeUrl,
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
    if (response.status === 403) {
      // window.location.replace("/");
      // localStorage.removeItem("token");
    }
    return error;
  }
};
const getCall = async (relativeUrl, payload) => {
  let response;
  try {
    // const token = JSON.parse(localStorage.getItem("token")).accessToken;
    // if (token === "undefined") {
    //   window.location.replace("/");
    // }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${token}`);
    // Convert payload to query string
    const queryString = payload
      ? "?" + new URLSearchParams(payload).toString()
      : "";

    const raw = JSON.stringify(payload);
    // console.log('raw', raw)
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      // body: raw,
      redirect: "follow",
    };
    const url = import.meta.env.VITE_API_URL + relativeUrl;
    response = await fetch(
      import.meta.env.VITE_API_URL + relativeUrl + queryString,
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
    if (response.status === 403) {
      // window.location.replace("/");
      // localStorage.removeItem("token");
    }
    return error;
  }
};
const uploadDocumentInLocal = async (file, directoryName) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      import.meta.env.VITE_API_URL + `/certificate/common/upload/uploadDocumentInLocal/${directoryName}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
  } catch (error) {
    toast.error("Error during processing. Please try again.", "error");
    console.log("error", error);
    return error;
  }
};









const postCallForgotPassword = async (relativeUrl, payload) => {
  let response;
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(payload);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    response = await fetch(
      process.env.REACT_APP_SERVICE_URL + relativeUrl,
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
    if (response.status === 403) {
      window.location.replace("/");
    }
    return error;
  }
};

const uploadCall = async (file) => {
  let result;
  try {
    const myHeaders = new Headers();
    myHeaders.append("file-name", file.name);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: file,
      redirect: "follow",
    };

    const response = await fetch(
      process.env.REACT_APP_IMAGE_SERVICE_URL + "/upload/Cbse",
      requestOptions,
    );
    return response;
  } catch (error) {
    showToast("Error during processing. Please try again.", "error");
    console.log("error", error);
    return error;
  }
};

const getImageFromS3 = async (s3key, handleLoading, shouldOpen = true) => {
  let response, result;
  try {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    handleLoading(true);
    response = await fetch(
      `${process.env.REACT_APP_IMAGE_SERVICE_URL}/getfile/Cbse/${s3key}`,
      requestOptions,
    );
    result = await response.json();

    if (result?.fileUrl && response.status === 200 && shouldOpen) {
      window.open(result?.fileUrl);
    }
    handleLoading(false);
    return result;
  } catch (error) {
    handleLoading(false);
    showToast("Error during processing. Please try again.", "error");
    console.log("error", error);
    return error;
  }
};

// const retrieveDocumentFromLocal = async (s3key, handleLoading, directoryName) => {
//   // alert(directoryName)
//   try {
//    handleLoading(true);
//    // Get the auth token (assuming you stored it in localStorage or sessionStorage)
//    const authToken = localStorage.getItem('token'); // Adjust if you're storing it elsewhere (like Redux or sessionStorage)
//    if (!authToken) {
//      throw new Error('Authentication token not found');
//    }
//    const fileUrl = `${process.env.REACT_APP_SERVICE_URL}/learningplatform/retrieve/retrieveDocumentFromLocal/${directoryName}/${s3key}`;
//    // Set up the fetch request with the Authorization header
//    const response = await fetch(fileUrl, {
//     method: 'GET', // Assuming you are doing a GET request
//     headers: {
//       // 'Authorization': `Bearer ${authToken}`
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to retrieve the document');
//   }
//    const link = document.createElement('a');
//    link.href = fileUrl;
//    link.download = s3key;
//    document.body.appendChild(link);
//    link.click();
//    document.body.removeChild(link);
//    handleLoading(false);
//  } catch (error) {
//   //  handleLoading(true);
//    toast.error("Error during processing. Please try again.", "error");
//    console.log("error", error);
//  }
// };
const retrieveDocumentFromLocal = async (s3key, handleLoading, directoryName) => {
  // alert(directoryName)
  try {
    handleLoading(true);
    // Get the auth token (assuming you stored it in localStorage or sessionStorage)
    const authToken = JSON.parse(localStorage.getItem("token")).accessToken; // Adjust if you're storing it elsewhere (like Redux or sessionStorage)
    if (!authToken) {
      // window.location.replace("/");
      throw new Error('Authentication token not found');
    }
    const fileUrl = `${process.env.REACT_APP_SERVICE_URL}/learningplatform/retrieve/retrieveDocumentFromLocal/${directoryName}/${s3key}`;
    // Set up the fetch request with the Authorization header
    const response = await fetch(fileUrl, {
      method: 'GET', // Assuming you are doing a GET request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to retrieve the document');
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = s3key;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    handleLoading(false);
  } catch (error) {
    handleLoading(false);
    toast.error("Error during processing. Please try again.", "error");
    console.log("error", error);
  }
};
export {
  getCall, getImageFromS3, loginCall, postCall, postCallForgotPassword, retrieveDocumentFromLocal, uploadCall, uploadDocumentInLocal
};

