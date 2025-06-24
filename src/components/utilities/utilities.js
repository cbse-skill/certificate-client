import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { uploadDocumentInLocal, uploadCall } from "../services/api";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { read, utils } from "xlsx";
import { getCall, uploadDocumentInLocal } from "../../services/api";


export const importExcelFile = async (file, fileObject, setExcelFileErrors) => {
  const reader = new FileReader();

  // Validate file metadata
  const fileName = file?.name?.split(".")[0];
  const fileType = file?.name?.split(".").pop()?.toLowerCase(); // safer parsing
  const fileSize = file?.size;

  // 1. Validate file type
  if (!["xls", "xlsx"].includes(fileType)) {
    toast.error("Please upload a file in .xls or .xlsx format.");
    return false;
  }

  // 2. Validate file name
  if (fileName !== fileObject?.fileTemplateName) {
    toast.error("Please upload the correct file template.");
    return false;
  }

  // 3. Validate file size (max 5MB)
  if (fileSize > 5 * 1024 * 1024) {
    toast.error("File size must not exceed 5MB.");
    return false;
  }

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (!sheets.length) {
          toast.error("Uploaded file has no sheets.");
          return reject("No sheets");
        }

        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);

        if (!rows.length) {
          toast.error("Uploaded file contains no data.");
          return reject("No data");
        }

        // Validate required fields
        const missingFieldInfo = fileObject.requiredFields.reduce((acc, field) => {
          const missingRows = rows
            .map((row, index) => (field in row && row[field] !== "" ? null : index + 2)) // +2 for Excel header + 1-based index
            .filter(rowNum => rowNum !== null);

          if (missingRows.length) {
            acc[field] = missingRows;
          }

          return acc;
        }, {});

        if (Object.keys(missingFieldInfo).length > 0) {
          const messages = Object.entries(missingFieldInfo)
            .map(([field, rowNums]) => `Missing field: "${field}" | Row(s): ${rowNums.join(", ")}`);

          setExcelFileErrors(messages);
          return reject("Missing required fields");
        }

        // Validate unique fields
        const duplicateErrors = checkUniqueFieldsInExcelFile(rows, fileObject?.uniqueFields, fileObject?.component);
        if (duplicateErrors.length) {
          setExcelFileErrors(duplicateErrors);
          return reject("Duplicate values found");
        }

        resolve(rows);
      } catch (error) {
        console.error("Excel file processing error:", error);
        toast.error("Error processing the file.");
        reject("Excel parse error");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the file.");
      reject("FileReader error");
    };

    reader.readAsArrayBuffer(file);
  });
};


export const checkUniqueFieldsInExcelFile = (rows, uniqueFields, component) => {
  const errors = [];
  const fieldNameSet = new Set();
  const duplicatesFieldName = [];
  // console.log('uniqueFields', uniqueFields)
  rows.forEach((row, index) => {
    let fieldValue = "";

    uniqueFields.forEach(fieldName => {
      let value = row[fieldName];

      if (value === undefined || value === null) {
        value = "N/A";
      }

      fieldValue += `${fieldName}: ${value} | `;
    });

    if (fieldNameSet.has(fieldValue)) {
      duplicatesFieldName.push({ fieldValue, row: index + 2 });
    } else {
      fieldNameSet.add(fieldValue);
    }
  });

  if (duplicatesFieldName.length > 0) {
    errors.push(...duplicatesFieldName.map(dup => `Duplicate: ${dup.fieldValue} found in row no- ${dup.row}`));
  }

  return errors;
};

export const loadLocation = async () => {
  try {
    const getLocations = await getCall("/certificate/common/location/getLocation");
    if (getLocations.data.status === 200) {
      return getLocations.data.result;
    }
    console.error("Failed to fetch locations: ", getLocations.data.status);
    return null;
  } catch (error) {
    console.log("Error fetching data", error);
    return null;
  }
};

export const handleFileUpload = async (e, directoryName) => {
  // alert(directoryName)
  try {
    const selectedFile = e;
    const response = await uploadDocumentInLocal(selectedFile, directoryName || 'default');
    // const response = await uploadCall(selectedFile);
    // const res = await response?.text();
    if (response.status === 200) {
      // return selectedFile;
      const fileData = response.data.fileData;
      return { selectedFile, fileData };
    } else if (response.status === 201) {
      // console.log("response", response);
      toast.error(response?.data?.message)
    } else {
      // toast.error("Error uploading. Please try again.", "error");
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

export const modifyPdf = async (row, action) => {
  const byteCharacters = atob(row?.certificate_template_details?.fileData); // Convert base64 string back to binary data
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  if (!blob || blob.size < 10) {
    alert('PDF file is not loaded.');
    return;
  }
  const fileArrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileArrayBuffer);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const item of row?.certificate_template_details?.certificate_template_fields || []) {
    if (item.field && typeof item['x-axis'] === 'number' && typeof item['y-axis'] === 'number') {
      firstPage.drawText(String(row[item.field] || 'test'), {
        x: item['x-axis'],
        y: item['y-axis'],
        size: item['size'] || 10,
        color: item['color'] || rgb(0, 0, 0),
        font
      });
    }
  }
  if (action === "save") {
    return await pdfDoc.save(); // returns Uint8Array
  }
  else {
    const pdfBytes = await pdfDoc.save();
    const blob1 = new Blob([pdfBytes], { type: 'application/pdf' });
    // Create a URL for the blob and open it in a new tab
    const blobUrl = URL.createObjectURL(blob1);
    const newTab = window.open();
    if (newTab) {
      newTab.location.href = blobUrl;
    } else {
      alert("Unable to open a new tab. Please check your browser settings.");
    }
  }
};