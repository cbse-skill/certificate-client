import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IconButton } from '@mui/material';
import { modifyPdf } from '../../utilities/utilities';
import "./certificateCard.css";

const CertificateCard = (props) => {
   
  // const [pdfFile, setPdfFile] = useState(null);

  //  useEffect(() => {
  //   if (props?.certificateData?.certificate_template_details?.fileData) {
  //     // Convert the base64 string back into binary data
  //     const byteCharacters = atob(props?.certificateData?.certificate_template_details?.fileData); // Convert base64 string back to binary data
  //     const byteArray = new Uint8Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteArray[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const blob = new Blob([byteArray], { type: 'application/pdf' });
  //     setPdfFile(blob);
  //   }
     
  // }, [props?.certificateData?.certificate_template_details?.fileData]);
 
  return (
    <>
        <IconButton
          aria-label="view"
          onClick={() => {
          // if (!pdfFile) {
          //   alert('PDF file is not loaded.');
          //   return;   
          // }
          return (
            modifyPdf(props.certificateData, "view")
          )
        }
            
          }
        >
        <PictureAsPdfIcon color="error"/>
      </IconButton> 
    </>
  );
};

export default CertificateCard;
