import CloseIcon from '@mui/icons-material/Close';
import { Grid, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCall, postCall } from "../../services/api";
import AutoCompleteSelect from '../common/selectInput/AutoCompleteSelect';
import { loadLocation } from '../utilities/utilities';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function CreateNewParticipantModalContainer({ open, title, onClose, sentResponseData }) {
  const [stateLoading, setStateLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [certificateTemplateData, setCertificateTemplateData] = useState([]);
    // const { loading, handleLoading } = useContext(LoadingContext);
  const [address, setAddress] = useState([]);

    const [bodyData, setBodyData] = useState({
        certificate_template_name: ''
      });

    const handleCloseButton = async () => { 
        onClose();
    };
     
    const handleSubmit = async () => {
        
      try {
        const payload = [bodyData];
             const response = await postCall(`/certificate/department/participant/createParticipant`, payload);
            if (response?.data?.status === 200) {
              // await loadData();
              sentResponseData(response?.data?.result)
              toast.success("Data submitted successfully");
            } else {
              toast.error("Submission failed. Please try again.");
            }
      } catch (err) {
        console.log(err)
          }
      setBodyData({});
      onClose();
          // setShowModal(false);        
      };  
    const handleInputChange = (e, index, field) => {
        const { name, value } = e.target;
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
        // console.log(newRole)
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
      let payload = {
         
      };
      const getDetails = await getCall(`/certificate/department/template/getTemplateList`, payload);
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
            </Toolbar>
                </AppBar>
          <Grid container p={4} spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Grid item container size={{xs:9}}>
            <Grid item size={{xs:3}}>
              <TextField
                type="input"
                label="Affiliation No"
                placeholder="Enter Affiliation No"
                name="affiliation_no"
                value={bodyData.affiliation_no}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item size={{xs:3}}>
              <TextField
                type="input"
                label="Participant Name"
                placeholder="Enter Participant Name"
                name="participant_name"
                value={bodyData.participant_name}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                size='small'
                fullWidth
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
              <TextField
                type="input"
                label="Participant Email"
                placeholder="Enter Participant Email"
                name="participant_email"
                value={bodyData.participant_email}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                size='small'
                fullWidth
              />
            </Grid>
            {/* <Grid item size={{xs:3}}>
              <TextField
                type="input"
                label="Event Name"
                placeholder="Enter Event Name"
                name="event_name"
                value={bodyData.event_name}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                size='small'
                fullWidth
              />
            </Grid> */}
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
          </Dialog >
        </React.Fragment >
    );
}
