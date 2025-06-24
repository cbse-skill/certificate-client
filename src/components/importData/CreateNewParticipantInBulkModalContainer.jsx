import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Grid, Paper } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import ImportParticipant from "../../assets/excels/ImportParticipant.xlsx";
// import { LoadingContext } from '../../components/common/context/LoaderContext';
import { toast } from 'react-toastify';
import { getCall, postCall } from "../../services/api";
import { LoadingContext } from '../common/context/LoaderContext';
import DragDropFile from "../common/dragAndDrop/DragAndDrop";
import AutoCompleteSelect from '../common/selectInput/AutoCompleteSelect';
import { importExcelFile, loadLocation } from "../utilities/utilities";

const columns = [
  { field: 'school_name', headerName: 'Name', width: 900 },
  { field: 'affiliation_no', headerName: 'Affiliation No', width: 100 },
  { field: 'school_code', headerName: 'School Code', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 },
 ];
const paginationModel = { page: 0, pageSize: 5 };

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function CreateNewParticipantInBulkModalContainer({ open, title, onClose, sentBulkResponseData }) {
      const { handleLoading } = useContext(LoadingContext);    
    const [excelFileErors, setExcelFileErrors] = useState([]);
      const [stateLoading, setStateLoading] = useState(false);
    
    const [responseData, setResponseData] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [getFile, setFile] = useState("");
     const [rows, setRows] = useState(0);
    const [uploaded, setUploaded] = useState(0);
    const [dataAlreadyExists, setDataAlreadyExists] = useState(0);
    const [detailsNotFound, setDetailsNotFound] = useState(0);
    const [errorCounts, setErrorCounts] = useState(0);
      const [certificateTemplateData, setCertificateTemplateData] = useState([]);
      const [address, setAddress] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

const [bodyData, setBodyData] = useState({
        certificate_template_name: ''
});
    // console.log('bodyData', bodyData)
    const noOfCount = async (data) => {
        setRows(data?.length); // Set the total number of rows
        // Initialize counters
        let uploadedCount = 0;
        let existingCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;

        // Iterate through the data to count occurrences
        data?.forEach((rw) => {
            if (rw.status === `exist`) {
                existingCount++;
            } else if (rw.status === "details not fetched") {
                notFoundCount++;
            } else if (rw.status === "error") {
                errorCount++;
            } else {
                uploadedCount++; // Assuming any other status indicates uploaded
            }
        });
        // Update state with the counted values
        setUploaded(uploadedCount);
        setDataAlreadyExists(existingCount);
        setDetailsNotFound(notFoundCount);
        setErrorCounts(errorCount);
    };
    const handleUpload = async (files) => {
        setFile(files);
    };
    const handleClose = () => {
        if (uploadedData?.length) {
            sentBulkResponseData([...uploadedData].reverse())
        }
        setShowModal(false);
        onClose();
    };
    const handleFinished = () => {
        setShowModal(false);
        sentBulkResponseData([...uploadedData].reverse())
        onClose();
    };
    // console.log('uploadedData);', uploadedData);
    const handleFileSelect = async (event) => {
        // alert()
        try {
            if (getFile) {
                 const fileObject = {
                    fileTemplateName: "ImportParticipant",
                    requiredFields: ["affiliation_no", "participant_name", "participant_email"],
                    uniqueFields: ["affiliation_no", "participant_name", "participant_email"],
                    component: "Participant"
                };
                handleLoading(true);
                const rows = await importExcelFile(getFile, fileObject, setExcelFileErrors);
                 if (!rows) return;// Early exit if upload failed
                // handleLoading(true);
                const chunkSize = 5000;
                let data = [];
                for (let i = 0; i < rows.length; i += chunkSize) {
                    const chunk = rows.slice(i, i + chunkSize).map(item => ({
                        ...item,
                        certificate_template_id: bodyData?.certificate_template_id,
                        participant_type: bodyData?.participant_type,
                        state: bodyData?.state,
                        district: bodyData?.district,
                      }));;
                    console.log('chunk',chunk)
                     const uploadData = await postCall("/certificate/department/participant/createParticipant", chunk);
                    if (uploadData.data.status === 200) {
                        data.push(uploadData.data.result); // Push all results from the current chunk
                    } else {
                        console.error('Error: Upload failed for chunk', chunk);
                    }
                }
                setResponseData(data);
                noOfCount(data);
                const filterResponse = data?.filter(qmc => qmc?.status === "uploaded");
                setUploadedData(filterResponse);
            } else {
                toast.error("please select a file")
            }
        } catch (error) {
            console.error("Error in file selection:", error);
        } finally {
            handleLoading(false);
        }
    };
    
    const handleDownloadClick = async () => {
        try {
            const response = await fetch(ImportParticipant);
            const blob = await response.blob();
            // Create a blob URL
            const url = window.URL.createObjectURL(blob);
            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;
            link.download = "ImportParticipant.xlsx";
            // Append the link to the body
            document.body.appendChild(link);
            // Programmatically trigger a click on the link
            link.click();
            // Remove the link from the body
            document.body.removeChild(link);
            // Release the object URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading Excel file:", error);
        }
    };
    
    const handleAutoCompletChange = (newRole, field) => {
    setBodyData((prevDetails) => {
      let updatedDetails = { ...prevDetails };
      if (field === "state") {
        updatedDetails = {
          ...updatedDetails,
          [field]: newRole?.label || "",
          state_id: newRole?.value || "",
          district: "", // Reset district if state changes
        };
      } else if (field === "status") {
         updatedDetails = {
          ...updatedDetails,
          [field]: newRole?.value || "",
        };
      } else if (field === "certificate_template_name") {
         updatedDetails = {
          ...updatedDetails,
          [field]: newRole?.label || "",
          certificate_template_s3_key : newRole?.certificate_template_s3_key  || "",
          certificate_template_id : newRole?.certificate_template_id  || ""
        }
      } else {
        updatedDetails = {
          ...updatedDetails,
          [field]: newRole?.label || "",
        };
      }

      return updatedDetails;
    });
  };
  const fetchCertificateTemplateList = async () => {
    try {
      setDataLoading(true);
      const getDetails = await getCall(`/certificate/department/template/getTemplateList`);
      if (getDetails.data.status === 200) {
        setCertificateTemplateData(getDetails.data.result);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setDataLoading(false);
    }
  };
   useEffect(() => {
      async function fetchData() {
        try {
          setStateLoading(true);
          const fetchAddress = await loadLocation();
          setAddress(fetchAddress);
          fetchCertificateTemplateList();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setStateLoading(false);
        }
      }
      fetchData();
    }, []);
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
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {title}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={(e) => handleFileSelect(e)} disabled = {responseData?.length}>
                            Upload
                        </Button>
                        <Button autoFocus color="inherit" onClick={(e) => handleFinished(e)}>
                            Finished
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container p={4} spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Grid item container size={{ xs: 9 }}>
                    <Grid item size={{ xs: 3 }}>
                              <AutoCompleteSelect
                                data={certificateTemplateData?.map((temp) => { return { value: temp.id, label: temp?.certificate_template_name, certificate_template_s3_key:temp?.certificate_template_s3_key, certificate_template_id: temp?.id } })}
                                label="Select Event"
                                value={bodyData?.certificate_template_name}
                                onChange={(newValue) => handleAutoCompletChange(newValue, 'certificate_template_name')}
                                disableClearable={false}
                                loading={dataLoading}
                               />
                                           </Grid>
                              <Grid item size={{ xs: 3 }}>
                                            <AutoCompleteSelect
                                              data={[{value:"teacher", label:"Teacher"}, {value:"student", label:"Student"}]}
                                              label="Select Participant Type"
                                              value={bodyData.participant_type}
                                              onChange={(newValue) => handleAutoCompletChange(newValue, 'participant_type')}
                                              disableClearable={false}
                                             />
                                             </Grid>
                            <Grid item size={{xs:3}}>
                              <AutoCompleteSelect
                                              data={address?.["State"]}
                                              label="Select State"
                                              value={bodyData.state}
                                              onChange={(newValue) => handleAutoCompletChange(newValue, 'state')}
                                              disableClearable={false}
                                              loading={stateLoading}
                                            />
                              </Grid>
                            <Grid item size={{xs:3}}>
                              <AutoCompleteSelect
                                              data={address?.["District"]?.filter(
                                                (a) => a.state_id == bodyData.state_id,
                                              )}
                                              label="Select District"
                                              value={bodyData.district}
                                              onChange={(newValue) => handleAutoCompletChange(newValue, 'district')}
                                              disableClearable={stateLoading}
                                            />
                              </Grid> 
                            </Grid>
                            </Grid> 
                    <Grid item size={{xs:12}}>
                        <Grid item container spacing={2} justifyContent={'center'}>
                            <Grid item size={{xs:12, sm:9}}>
                                <Button
                                    variant="text"
                                    onClick={handleDownloadClick}
                                    startIcon={<FileDownloadIcon />}>
                                    <Typography
                                        fontWeight={600}
                                        color='primary'
                                    > Download Import Data Template File
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item size={{xs:12, sm:9}}>
                                <DragDropFile
                                    handleUpload={(e) => {handleUpload(e), setResponseData([])}}
                                    type=".Xls (Less then 5mb)"
                                    filename={getFile?.name}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 9 }}>                                 
                                {(responseData?.length > 0) && <>
                                    <Grid item container spacing={4}>
                                        <Grid item size={{ xs: 12, sm: 3 }} >
                                            <Paper elevation={3} sx={{ width: '100%', display: 'block', justifyContent: 'center', alignItems:'center'}}>
                                                    <Typography variant='h3' display={'flex'} justifyContent={'center'} color='#17a2b8'>{rows}</Typography>
                                                    <Typography variant='h6'display={'flex'} justifyContent={'center'}>Total No of rows</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item size={{ xs: 12, sm: 3 }}>
                                            <Paper elevation={3} sx={{ width: '100%', display: 'block', justifyContent: 'center', alignItems:'center'}}>
                                                    <Typography variant='h3' display={'flex'} justifyContent={'center'} color='#28a745'>{uploaded}</Typography>
                                                    <Typography variant='h6'display={'flex'} justifyContent={'center'}>No of Uploaded</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item size={{ xs: 12, sm: 3 }}>
                                            <Paper elevation={3} sx={{ width: '100%', display: 'block', justifyContent: 'center', alignItems:'center'}}>
                                                    <Typography variant='h3' display={'flex'} justifyContent={'center'} color='#ffc107'>{dataAlreadyExists}</Typography>
                                                    <Typography variant='h6'display={'flex'} justifyContent={'center'}>No of Exits</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item size={{ xs: 12, sm: 3 }}>
                                            <Paper elevation={3} sx={{ width: '100%', display: 'block', justifyContent: 'center', alignItems:'center'}}>
                                                    <Typography variant='h3' display={'flex'} justifyContent={'center'} color='#f44336'>{errorCounts}</Typography>
                                                    <Typography variant='h6'display={'flex'} justifyContent={'center'}>No of Errors</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item size={{ xs: 12 }}>
                                            <DataGrid
                                                  rows={responseData.map((row, index)=> ({...row,id:index+1}))}
                                                  columns={columns}
                                                  initialState={{ pagination: { paginationModel } }}
                                                  pageSizeOptions={[5, 10]}
                                                   sx={{ border: '1px solid #e0e0e0' }}
                                                />
                                        </Grid>
                                    </Grid>
                                    
                                </>}
                            </Grid>
                            <Grid item size={{xs:12, sm:9}}>
                                {(excelFileErors?.length > 0) &&
                                    <table className="career-table">

                                        <thead>
                                            <tr>
                                                <th className="">Row No</th>
                                                <th className="">Errors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {excelFileErors?.map((error, ind) => (
                                                <tr key={ind}>
                                                    <td>{ind + 1}</td> {/* Add 1 for human-readable row number */}
                                                    <td>{error}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
            </Dialog >
        </React.Fragment >
    );
}
