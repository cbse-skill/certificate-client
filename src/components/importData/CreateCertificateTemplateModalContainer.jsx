import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
// import UploadQMCTemplate from "../../assets/Excel/UploadQMCTemplate.xlsx";
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import TooltipButton from "../../components/common/tooltipButton/TooltipButton";
import { postCall } from "../../services/api";
import DragAndDrop from '../common/dragAndDrop/DragAndDrop';
import { handleFileUpload } from '../utilities/utilities';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'school_name', headerName: 'Name', width: 900 },
  { field: 'school_code', headerName: 'School Code', width: 100 },
  { field: 'affiliation_no', headerName: 'Affiliation No', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 },
 ];
const paginationModel = { page: 0, pageSize: 5 };

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function CreateCertificateTemplateModalContainer({ open, title, viewData, onClose, sentResponseData }) {
    const [responseData, setResponseData] = useState([]);
    // const { loading, handleLoading } = useContext(LoadingContext);
    const [inputs, setInputs] = useState([]);
    const [getFile, setFile] = useState("");
    const [bodyData, setBodyData] = useState({
        certificate_template_name: '',
        certificate_template_date: '',
        certificate_template_fields: [
          { field: "", "x-axis": "", "y-axis": "" }
        ]
      });
      // console.log('bodyData', bodyData)
      const handleClose = () => {
        setShowModal(false);
      };
    
      const handleShow = () => {
        setShowModal(true);
      };
    const handleInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setInputs({ ...inputs, [name]: value });
    };
    const handleCreateButton = async (event) => {
        const schoolAffiliationNo = inputs?.affiliation_no;

            // Validation: check if schoolAffiliationNo exists
            if (!schoolAffiliationNo) {
                toast.error("Please enter school code.");
                return;
            }

            // Validation: only numbers
            const numberRegex = /^\d+$/;
            if (!numberRegex.test(schoolAffiliationNo)) {
                toast.error("School code must contain only numbers.");
                return;
            }

            // Validation: min and max length (example: min 4 digits, max 8 digits)
            const minLength = 5;
            const maxLength = 10;
            if (schoolAffiliationNo.length < minLength || schoolAffiliationNo.length > maxLength) {
                toast.error(`School code must be between ${minLength} and ${maxLength} digits.`);
                return;
            }
        try {
           const createData = await postCall("/districtSkillCoordinator/department/dscList/uploadDSCList", [{affiliation_no: inputs?.affiliation_no}]);
            if (createData.data.status === 200) {
                // console.log('createData.data.results', createData.data.results)
                 if (createData.data.results[0].status === "exist") { 
                    toast.error(`Coordinator already exist for this school affiliation no: ${createData.data.results[0].affiliation_no}`);
                 } else if (createData.data.results[0].status === "error") {
                     toast.error(`School affiliation no "${inputs?.affiliation_no}" is incorrect.`);
                 } else {
                     toast.success(`Coordinator has been created succesfully for school affiliation_no: ${createData.data.results[0].affiliation_no}`)
                }  
                setResponseData(createData.data.results[0].status !== "error" ? createData.data.results : [])
                } else {
                    console.error('Error: Upload failed for chunk');
                }
        } catch (error) {
            console.error("Error in file selection:", error);
        } finally {
        }
    };

    const handleCloseButton = async () => {
        if (responseData?.length) {
            sentResponseData(responseData[0]);
        }
        onClose();
    };

    const handleResetButton = async () => {
        setInputs([]);
        setResponseData([]);
    };
    
    const handleFinished = () => {
        sentResponseData(responseData[0])
        onClose();
    };
    const handleSubmit = async () => {
        const file = await handleFileUpload(getFile, 'Certificate Templates');
        console.log('file', file)
        if (file) {
          try {
            const response = await postCall(`/certificate/department/template/uploadTemplate`, { ...bodyData, certificate_template_s3_key: file?.fileData?.filename });
            if (response?.data?.status === 200) {
              toast.success("Data submitted successfully");
              await loadData();
            } else {
              toast.error("Submission failed. Please try again.");
            }
          } catch (err) {
          }
          setBodyData({
            certificate_template_name: '',
            certificate_template_date: '',
            certificate_template_fields: [
              { field: "", "x-axis": "", "y-axis": "" }
            ]
          });
          setFile("");
          setShowModal(false);
        }
      };
    
    // console.log('responseData', responseData);
    // console.log('inputs', inputs);
    const handleUpload = async (files) => {
        setFile(files);
    };
    const handleInputChange = (e, index, field) => {
        const { name, value } = e.target;
        console.log(name, value, index, field)
        if (!field) {
          setBodyData({
            ...bodyData,
            [name]: value
          })
        } else {
          const updatedFields = [...bodyData.certificate_template_fields];
          updatedFields[index] = { ...updatedFields[index], [field]: value };
    
          setBodyData({
            ...bodyData,
            certificate_template_fields: updatedFields
          });
        }
        // Handle input change for specific fields in the array
      };
    const addField = () => {
        const newField = {
          [`field`]: "",
          "x-axis": "",
          "y-axis": ""
        };
        setBodyData({
          ...bodyData,
          certificate_template_fields: [...bodyData.certificate_template_fields, newField]
        });
      }
    
      const deleteField = (index) => {
        const updatedFields = bodyData.certificate_template_fields.filter((_, i) => i !== index);
        setBodyData({
          ...bodyData,
          certificate_template_fields: updatedFields
        });
      };
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseButton}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {title}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={(e) => handleSubmit(e)}
                            // disabled={responseData?.length}
                        >
                            Upload
                        </Button>
                        <Button autoFocus color="inherit" onClick={(e) => handleFinished(e)}>
                            Finished
                        </Button>
                    </Toolbar>
                </AppBar>
                
        <div className="circular-container">
          <DragAndDrop
            handleUpload={handleUpload}
            type=".xls, .docx, .pdf, .pptx, .jpeg (Less than 5mb)"
            filename={getFile?.name || ""}
          />
          <TextField
            type="input"
            label="Certificate/Event Name"
            placeholder="Enter Certificate Name"
            name="certificate_template_name"
            value={bodyData.certificate_template_name}
            onChange={(e) => handleInputChange(e)}
            className="mt-4"
          />
          <TextField
            type="date"
            label="Date"
            placeholder="Certificate Date"
            name="certificate_template_date"
            value={bodyData.certificate_template_date}
            onChange={(e) => handleInputChange(e)}
            className="circular-input"
          />
          <table className="common-table">
            <thead>
              <tr>
                <th>SL No</th>
                <th>Fields</th>
                <th>X-Axis</th>
                <th>Y-Axis</th>
                <th>
                                <TooltipButton
                  id="add-courseCatelogSkillModules"
                  content="Add More"
                  onClick={() => addField()}
                />
                </th>
              </tr>
            </thead>
            <tbody>
              {bodyData?.certificate_template_fields?.slice(0, 5)?.map((field, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="p-2"><TextField
                    type="input"
                    placeholder="Enter Field name"
                    name={`certificate_template_fields`}
                    value={field[`field`]}
                    onChange={(e) => handleInputChange(e, index, `field`)}
                    className="m-0"
                  />
                  </td>
                  <td className="p-2"><TextField
                    type="input"
                    placeholder="Enter X-Axis"
                    name="x-axis"
                    value={field["x-axis"]}
                    onChange={(e) => handleInputChange(e, index, "x-axis")}
                    className="m-0"
                  /></td>
                  <td className="p-2"><TextField
                    type="input"
                    placeholder="Enter Y-Axis"
                    name="y-axis"
                    value={field["y-axis"]}
                    onChange={(e) => handleInputChange(e, index, "y-axis")}
                    className="m-0"
                  /></td>
                  <td>
                    <div className="download-container">
                      <TooltipButton
                        id="delete-courseCatelogSkillModules"
                        content="Delete"
                        onClick={() => deleteField(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button type="button" className="add-button" onClick={addField}>
            Add New Field
          </button> */}
        </div>
            </Dialog >
        </React.Fragment >
    );
}
