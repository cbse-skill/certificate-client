import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { postCall } from "../../services/api";
import { LoadingContext } from '../common/context/LoaderContext';
import Editor from '../common/editor/Editor';
import { modifyPdf } from '../utilities/utilities';
 
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function EmailSendModalContainer({ open, title, mailRowDetails, onClose, sentResponseData }) {
  const { loading, handleLoading } = useContext(LoadingContext);
  const [responseData, setResponseData] = useState();
  const [editorContent, setEditorContent] = useState(``); 

  const handleCloseButton = async () => {
        if (responseData) {
            sentResponseData(responseData);
        }
        onClose();
    };

  const handleSendEmail = async () => {
    let responseDetails;
    try {
      handleLoading(true)
      const pdfBytes = await modifyPdf(mailRowDetails, "save");
      const payload = {
        participant_id : mailRowDetails.id,
          emailTo: mailRowDetails.participant_email,
          editorContent: editorContent,
          pdf: Array.from(new Uint8Array(pdfBytes)), // safely serialize for JSON
        };
        const getDetails = await postCall(`/certificate/common/email/sendEmail`, payload);
        if (getDetails.data.status === 200) {
          responseDetails = getDetails.data.result.dataValues;
      }
      toast.success("Email has been sent successfully.")
      } catch (error) {
      console.log("Error fetching data", error);
      toast.error("Error")
      } finally {
        if (responseDetails) {
          sentResponseData(responseDetails);
        }
        onClose();
        handleLoading(false);
      }
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
                        <Button autoFocus color="inherit" onClick={(e) => handleSendEmail(e)}
                         >
                            Send
                        </Button> 
                    </Toolbar>
                </AppBar>
          <Grid container p={4} spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}> 
            <Grid item container size={{ xs: 12 }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Editor value={editorContent} onChange={setEditorContent} />
              </Grid>
            
          </Grid> 
          </Dialog >
        </React.Fragment >
    );
}
