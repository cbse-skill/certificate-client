import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { memo, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { LoadingContext } from '../../components/common/context/LoaderContext';
import AutoCompleteSelect from '../../components/common/selectInput/AutoCompleteSelect';
import CreateNewParticipantInBulkModalContainer from '../../components/importData/CreateNewParticipantInBulkModalContainer';
import CreateNewParticipantModalContainer from '../../components/importData/CreateNewParticipantModalContainer';
import EmailSendModalContainer from '../../components/importData/EmailSendModalContainer';
import { loadLocation, modifyPdf } from '../../components/utilities/utilities';
import { getCall, postCall } from '../../services/api';

const paginationModel = { page: 0, pageSize: 10 };

const StyledMenu = memo(styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    sx={{
      position: 'absolute',
      left: 0
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
})));

export default function ListOfEventsData() {
  const { handleLoading } = useContext(LoadingContext);
  const [stateLoading, setStateLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [openCreateNewInBulk, setOpenCreateNewInBulk] = useState(false);
  const [openCreateNew, setOpenCreateNew] = useState(false);
  const [openEmailSendModal, setEMailSendModal] = useState(false);
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isCreateNew = Boolean(anchorEl);
  const [address, setAddress] = useState([]);
  const [filter, setFilter] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [mailRowDetails, setMailRowDetails] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [certificateTemplateData, setCertificateTemplateData] = useState([]);
  // console.log('filter', filter)
  const columns = [
    { field: 'id', headerName: 'Sr. No', width: 70 },
    { field: 'no_of_mail_recieved', headerName: 'Count', width: 70 },
    { field: 'participant_name', headerName: 'Participant Name', width: 250 },
    { field: 'participant_type', headerName: 'Participant Type', width: 150 },
    { field: 'participant_email', headerName: 'Participant Email', width: 250 },
    {
      field: 'certificate_template_name',
      headerName: 'Event Name',
      width: 250,
      renderCell: (params) => params?.row?.certificate_template_details?.certificate_template_name || ''
    },
    { field: 'affiliation_no', headerName: 'Affiliation No', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'district', headerName: 'District', width: 150 },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (params) => {
        const isActive = params.value;
        return (
          isActive
            ? <Typography variant='caption' color='success.main' fontWeight={600}>Active</Typography>
            : <Typography variant='caption' color='error.main'>Deactive</Typography>
        );
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      width: 200,
      cellClassName: 'actions',
      getActions: (params) => {
        const row = params.row; // ✅ This gives you the full row data
        // console.log('row', row)
        return row?.certificate_template_details?.fileData
          ? [
            <IconButton aria-label="view" onClick={() => modifyPdf(row, "view")}>
              <PictureAsPdfIcon color="error" />
            </IconButton>,
            <Button onClick={() => {setMailRowDetails(row), setEMailSendModal(true)}}>Send mail</Button>
      ]
    : [];
      }
    }

  ]; 

  const handleDropDownButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownButtonClose = () => {
    setAnchorEl(null);
  };

  const handleAutoCompletChange = (newRole, field) => {
    setFilter((prevDetails) => {
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
        // console.log(newRole);
        updatedDetails = {
          ...updatedDetails,
          certificate_template_id: newRole?.value || "",
          certificate_template_name: newRole?.label || "",
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
  const fetchEventsDataList = async () => {
    try {
      setDataLoading(true);
      let payload = {
        state: filter?.state,
        district: filter?.district,
        participant_type: filter?.participant_type,
        certificate_template_id: filter?.certificate_template_id,
      };
      const getDetails = await getCall(`/certificate/department/participant/getParticipant`, payload);
      if (getDetails.data.status === 200) {
        setData(getDetails.data.result);
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
        fetchCertificateTemplateList();
        const fetchAddress = await loadLocation();
        setAddress(fetchAddress);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setStateLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchEventsDataList();
  }, [filter]);

  const handleSelectedRowButton = async (ids, type) => {
    try {
      if (type === "reject" && (!inputs?.reason || inputs?.reason === "")) {
        toast.error("Please provide reason for rejection*");
        return false;
      }
      let payload = {
        ids: ids,
        statusType: type,
        reason: type === "reject" ? inputs?.reason : null
      }
      const createData = await postCall("/districtSkillCoordinator/department/dscList/requestDSC", payload);
      if (createData.data.status === 200) {
        const updatedResults = createData.data.results;
        setData(prevData =>
          prevData.map(school => {
            const update = updatedResults.find(
              updated => updated.school_id === school.school_id
            );
            if (update) {
              return {
                ...school,
                master_district_skill_coordinator_request: {
                  ...school.master_district_skill_coordinator_request,
                  status: update.status,
                  school_id: update.school_id,
                  reason: update.reason
                }
              };
            }

            return school;
          })
        );

        toast.success(createData.data.message);
      } else {
        console.error('Error: Something was wrong');
      }
    } catch (error) {
      console.error("Error in file selection:", error);
    } finally {
      setSelectedRow([]);
       setInputs([]);
    }
  }
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Grid container spacing={3} sx={{ width: '100%', flexGrow: 1 }}>
          <Grid item container size={{ xs: 12, sm: 6 }}>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <AutoCompleteSelect
                data={address?.["State"]}
                label="Select State"
                value={filter.state}
                onChange={(newValue) => handleAutoCompletChange(newValue, 'state')}
                disableClearable={false}
                loading={stateLoading}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <AutoCompleteSelect
                data={address?.["District"]?.filter(
                  (a) => a.state_id == filter.state_id,
                )}
                label="Select District"
                value={filter.district}
                onChange={(newValue) => handleAutoCompletChange(newValue, 'district')}
                disableClearable={stateLoading}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <AutoCompleteSelect
                data={[{value:"teacher", label:"Teacher"}, {value:"student", label:"Student"}]}
                label="Select Participant Type"
                value={filter.participant_type}
                onChange={(newValue) => handleAutoCompletChange(newValue, 'participant_type')}
                disableClearable={stateLoading}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <AutoCompleteSelect
                data={certificateTemplateData?.map((temp) => { return { value: temp.id, label: temp?.certificate_template_name} })}
                label="Select Event"
                value={filter?.certificate_template_name}
                onChange={(newValue) => handleAutoCompletChange(newValue, 'certificate_template_name')}
                disableClearable={false}
                loading={dataLoading}
                />
            </Grid>
          </Grid>
          <Grid item container size={{ xs: 12, sm: 6 }} justifyContent={'right'}>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <Button variant='outlined' color='primary' fullWidth onClick={() => handleSelectedRowButton([...selectedRow], 'approve')} disabled={[...selectedRow]?.length <= 0} size='small' sx={{ lineHeight: '2.2' }}>Approve Seleced Rows</Button>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              {openCreateNew &&
                <CreateNewParticipantModalContainer
                  open={openCreateNew}
                  onClose={() => { setOpenCreateNew(false) }}
                  title={'Add New Participant'}
                  sentResponseData={(newData) => setData(prevData => ([newData, ...prevData]))}
                />}
              {openCreateNewInBulk &&
                <CreateNewParticipantInBulkModalContainer
                  open={openCreateNewInBulk}
                  onClose={() => { setOpenCreateNewInBulk(false) }}
                  title={'Add New Participants'}
                  sentResponseData={(newData) => setData(prevData => ([newData, ...prevData]))}
                />}
              <Button
                id="demo-customized-button"
                aria-controls={isCreateNew ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isCreateNew ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleDropDownButton}
                endIcon={<KeyboardArrowDownIcon />}
                fullWidth
              >
                Create New
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={isCreateNew}
                onClose={handleDropDownButtonClose}
              >
                <MenuItem onClick={() => { handleDropDownButtonClose(false); setOpenCreateNew(true) }} disableRipple>
                  <AddIcon />
                  Create New Participant
                </MenuItem>
                <MenuItem onClick={() => { handleDropDownButtonClose(false); setOpenCreateNewInBulk(true) }} disableRipple>
                  <AddIcon />
                  Create New Participant in Bulk
                </MenuItem>
              </StyledMenu>
            </Grid>
          </Grid>
          <Grid item container size={{ xs: 12 }}>
            <Grid item size={{ xs: 12 }} sx={{
              scrollbarWidth: 'thin', // Firefox
              scrollbarColor: '#888 #f1f1f1', // Firefox
            }}>
              <Divider width={'100%'} />
              <DataGrid
                label={<Typography variant='h5' fontWeight={600}>List of Participant</Typography>}
                rows={data}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 50, { value: -1, label: 'All' }]}
                checkboxSelection
                disableRowSelectionOnClick
                keepNonExistentRowsSelected
                sx={{
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                    fontSize: 16,
                  },
                  '--DataGrid-overlayHeight': '380px',
                  maxHeight: 600
                }}
                loading={dataLoading}
                slotProps={{
                  loadingOverlay: {
                    variant: 'skeleton',
                    noRowsVariant: 'skeleton',
                  },
                  toolbar: {
                    fileName: 'customerDataBase',
                    delimiter: ';',
                    utf8WithBom: true,
                    printOptions: { disableToolbarButton: false },
                  },
                }}
                density='compact'
                showCellVerticalBorder
                showColumnVerticalBorder
                disableColumnFilter
                disableColumnSelector
                showToolbar
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedRow(newRowSelectionModel?.ids);
                }}
                rowSelectionModel={{
                  type: 'include',
                  ids: new Set(selectedRow),
                }}
                isRowSelectable={(params) => params?.row?.master_district_skill_coordinator_request?.status !== "approve" && params?.row?.master_district_skill_coordinator_request?.status !== "reject"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {/* Dialog Modal */}
      {openEmailSendModal &&
        <EmailSendModalContainer
          open={openEmailSendModal}
          onClose={() => { setEMailSendModal(false) }}
          title={'Write the message for email'}
          mailRowDetails={mailRowDetails}
          sentResponseData={(newData) => setData(prevData =>
            prevData.map(item => item.id === newData.id ? {...item, no_of_mail_recieved : newData.no_of_mail_recieved, mail_recieved : newData.mail_recieved} : item)
          )}
          
        />}
    </Box>
  );
}
