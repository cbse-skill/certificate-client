import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Divider, Menu, MenuItem, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { memo, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import CertificateCard from '../../components/common/certificateCard/CertificateCard';
import { LoadingContext } from '../../components/common/context/LoaderContext';
import DialogContainer from '../../components/common/dialog/DialogContainer';
import InformationDialogContainer from '../../components/common/dialog/InformationDialogContainer';
import AutoCompleteSelect from '../../components/common/selectInput/AutoCompleteSelect';
// import CreateDistrictSkillCoordinatorInBulkModalContainer from '../../components/importData/CreateDistrictSkillCoordinatorInBulkModalContainer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import CreateCertificateTemplateModalContainer from '../../components/importData/CreateCertificateTemplateModalContainer';
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

export default function ListOfCertificateTemplate() {
  const { handleLoading } = useContext(LoadingContext);
  const [stateLoading, setStateLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [openCreateNewInBulk, setOpenCreateNewInBulk] = useState(false);
  const [openCreateNew, setOpenCreateNew] = useState(false);
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isCreateNew = Boolean(anchorEl);
  const [address, setAddress] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dialogModalOpen, setDialogModalOpen] = useState(false);
  const [informationDialogModalOpen, setInformationDialogModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  // console.log('selectedRow', selectedRow);
  const [inputs, setInputs] = useState([]);
  const columns = [
    { field: 'id', headerName: 'Sr. No', width: 70 },
    { field: 'certificate_template_name', headerName: 'Certificate/Event Name', width: 500 },
    {
      field: 'certificate_template_IsActive', headerName: 'Status', width: 200,
      renderCell: (params) => {
        const isActive = params.value;
        return (
          isActive
            ? <Typography variant='caption' color='success.main' fontWeight={600}>Active</Typography>
            : <Typography variant='caption' color='error.main'>Deactive</Typography>
        );
      }
    },
    // { field: 'certificate_template_s3_key', headerName: 'S3 Key', width: 250, filterable: false, sortable: false },
    { field: 'certificate_template_date', headerName: 'Date', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Preview',
      width: 300,
      cellClassName: 'actions',
      getActions: (params) => {
        const row = params.row; // ✅ This gives you the full row data
        // console.log('row', row)
        return [
          // <IconButton
          //   // aria-label="view"
          //   // onClick={() => modifyAndDownloadPdf()}
          // >
          //   <VisibilityIcon color="primary"/>
          // </IconButton>,
          <CertificateCard certificateData={row} />,
          <Button onClick={()=> handleSendEmail(row)}>Send mail</Button>
        ];
      }
    }

  ];

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  };

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
        state: filter?.state,
        district: filter?.district,
        status:filter?.status
      };
      const getDetails = await getCall(`/certificate/department/template/getTemplateList`, payload);
      if (getDetails.data.status === 200) {
        setData(getDetails.data.result);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setDataLoading(false);
    }
  };
  const modifyAndAttachedPdf = async (row) => {
    const byteCharacters = atob(row.fileData); // Convert base64 string back to binary data
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      if (!blob) {
        alert('PDF file is not loaded.');
        return;
      }
      const fileArrayBuffer = await blob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      for (const item of row.certificate_template_fields || []) {
        if (item.field && typeof item['x-axis'] === 'number' && typeof item['y-axis'] === 'number') {
          firstPage.drawText(String(row.field || 'test'), {
            x: item['x-axis'],
            y: item['y-axis'],
            size: item['size'] || 10,
            color: item['color'] || rgb(0, 0, 0),
            font
          });
        }
      }
    
      return await pdfDoc.save(); // returns Uint8Array       
    };
  const handleSendEmail = async (row) => {
    try {
      const pdfBytes = await modifyAndAttachedPdf(row);
      const payload = {
      pdf: Array.from(new Uint8Array(pdfBytes)) // safely serialize for JSON
    };
      const getDetails = await postCall(`/certificate/common/email/sendEmail`, payload);
      if (getDetails.data.status === 200) {
        // setData(getDetails.data.result);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      // setDataLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setStateLoading(true);
        const fetchAddress = await loadLocation();
        setAddress(fetchAddress)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setStateLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchCertificateTemplateList();
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
      setDialogModalOpen(false);
      setInputs([]);
    }
  }
  return (
    <Box
      sx={{
        // display: 'flex',
        // flexWrap: 'wrap',
        // '& > :not(style)': {
        //   // m: 4,
        //   width: "100%",
        // },
        // p:4
      }}
    >
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
                data={[{label:"Approved", value:"Approved"},{label:"Rejected", value:"Rejected"}]}
                label="Select Status"
                value={filter.status}
                onChange={(newValue) => handleAutoCompletChange(newValue, 'status')}
                disableClearable={stateLoading}
              />
            </Grid>
          </Grid>
          <Grid item container size={{ xs: 12, sm: 6 }} justifyContent={'right'}>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <Button variant='outlined' color='primary' fullWidth onClick={() => handleSelectedRowButton([...selectedRow], 'approve')} disabled={[...selectedRow]?.length <= 0} size='small' sx={{lineHeight:'2.2'}}>Approve Seleced Rows</Button>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }} >
              <Button variant='outlined' color='warning' fullWidth onClick={() => { setDialogModalOpen(true) }} disabled={[...selectedRow]?.length <= 0} size='small' sx={{lineHeight:'2.2'}}>Reject Seleced Rows</Button>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              {openCreateNew &&
                <CreateCertificateTemplateModalContainer
                  open={openCreateNew}
                  onClose={() => { setOpenCreateNew(false) }}
                  // skillOptions={skillOptions}
                  title={'Create New Certificat Template'}
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

              ><MenuItem onClick={() => { handleDropDownButtonClose(false); setOpenCreateNew(true) }} disableRipple>
                  <AddIcon />
                  Create New Certificate template
                </MenuItem> 
              </StyledMenu>
            </Grid>
          </Grid>
          <Grid item container size={{ xs: 12 }}>
            <Grid item size={{ xs: 12 }} sx={{ 
              scrollbarWidth: 'thin', // Firefox
              scrollbarColor: '#888 #f1f1f1', // Firefox
            }}>
          <Divider width={ '100%'} />
          <DataGrid
              label={<Typography variant='h5' fontWeight={600}>Lis of Certificate Templates</Typography>}
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
      <DialogContainer
        title="Rejection Reason"
        handleDialogCloseButtom={() => { setDialogModalOpen(false), setSelectedRow([]) }}
        handleDialogSubmitButtom={() => { handleSelectedRowButton([...selectedRow], 'reject') }}
        dialogModalOpen={dialogModalOpen}
        
      >
        <Typography gutterBottom>Please provide reason for rejection*</Typography>
        <TextField id="outlined-basic" label="" variant="outlined" multiline rows={4} fullWidth name="reason" value={inputs?.reason || ""} onChange={(e) => handleInputs(e)} />
      </DialogContainer>
      <InformationDialogContainer
        title="Rejection Reason"
        handleDialogCloseButtom={() => { setInformationDialogModalOpen(false), setSelectedRow([]) }}
        dialogModalOpen={informationDialogModalOpen}
        information={selectedRow[0]?.master_district_skill_coordinator_request?.reason}
      >
        </InformationDialogContainer>
    </Box>
  );
}
