import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { retrieveDocumentFromLocal } from "../../../services/api";
import "./TooltipButton.css";

// import rightIcon from "../../../assets/images/arrow.png";
// import closeIcon from "../../../assets/images/close-gradient.png";
// import minusIcon from "../../../assets/images/minus-gradient.png";
// import newIcon from "../../../assets/images/new-gradient.png";
// import plusIcon from "../../../assets/images/plus-gradient.png";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import EditIcon from '@mui/icons-material/Edit';
// import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import checkedIcon from "../../../assets/images/checksquare.png";
import { IconButton, Tooltip } from "@mui/material";
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#eab100',
        color: '#f8f8f8',
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}));
const TooltipButton = ({
    id,
    content,
    variant,
    onClick = () => { },
    disabled = false,
    s3Key,
    handleLoading = () => { },
    directoryPath,
    className,
    iconFontSize = "large"
}) => {
    let idFirstIndex = id?.split("-")[0];
    let idSecondIndex = id?.split("-")[1];
    // console.log("image", image);
    return (
        <>
            {idFirstIndex === "add" && <>
                <CustomTooltip title={content} arrow placement="top">
                    <IconButton aria-label="delete" color="primary" disabled={disabled} onClick={() => {
                        onClick();
                    }} size={iconFontSize}>
                        <AddCircleOutlineIcon fontSize={iconFontSize} />
                    </IconButton>
                </CustomTooltip >

            </>
            }
            {/* {idFirstIndex === "edit" && <>
                <CustomTooltip title={content} arrow placement="top">
                    <IconButton aria-label="delete" color="default" disabled={disabled} onClick={() => {
                        onClick();
                    }} size={iconFontSize}>
                        <EditIcon fontSize={iconFontSize} />
                    </IconButton>
                </CustomTooltip >

            </>
            } */}
            {/* {idFirstIndex === "view" && <>
                <CustomTooltip title={content} arrow placement="top">
                    <IconButton aria-label="delete" color="primary" disabled={disabled} onClick={() => {
                        onClick();
                    }} size={iconFontSize}>
                        <VisibilityIcon fontSize={iconFontSize} />
                    </IconButton>
                </CustomTooltip >

            </>
            } */}
            {idFirstIndex === "delete" &&
                <CustomTooltip title={content} arrow placement="top">
                    <IconButton aria-label="delete" color="error" disabled={disabled} onClick={() => {
                        onClick();
                    }} size={iconFontSize}>
                        <DeleteOutlineIcon size={iconFontSize} />
                    </IconButton>
                </CustomTooltip >
            }
            {/* {idFirstIndex === "play" &&
                <CustomTooltip title={content} arrow placement="top">
                    <IconButton aria-label="play" color="primary" disabled={disabled} onClick={() => {
                        onClick();
                    }} size={iconFontSize}>
                        <PlayCircleFilledTwoToneIcon size={iconFontSize} />
                    </IconButton>
                </CustomTooltip >
            } */}
            <ReactTooltip
                id={`tooltip-${id}`}
                place="top"
                variant={variant || "warning"}
                content={content}
            />
            {idFirstIndex === "upload" && <img src={FileUploadIcon} alt={`${idFirstIndex}-icon`} data-tooltip-id={`tooltip-${id}`} className="uploadButtonImageSize" onClick={() => {
                onClick();
            }} />}
            {idFirstIndex === "download" && <img src={DownloadIcon} alt={`${idFirstIndex}-icon`} data-tooltip-id={`tooltip-${id}`} className="downloadButtonImageSize" onClick={() => {
                retrieveDocumentFromLocal(
                    s3Key,
                    handleLoading,
                    directoryPath
                );
            }} />}
            {/* {idFirstIndex === "downloadStudentCertificate" && <img src={DownloadIcon} alt={`${idFirstIndex}-icon`} data-tooltip-id={`tooltip-${id}`} className="downloadButtonImageSize" onClick={() => {
                onClick();
            }} />} */}
            {/* {idFirstIndex === "add" && <>
                <img src={addIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`addButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            </>
            } */}
            {/* {idFirstIndex === "view" &&
                <img src={viewIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`viewButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "viewAll" &&
                <img src={rightIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`viewAllButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "edit" &&
                <img src={editIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`editButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "delete" &&
                <img src={cancelIcon} disable data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`${className} deleteButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "new" &&
                <img src={newIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`newButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            }
            {idFirstIndex === "maximize" &&
                <img src={plusIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`plusButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            }
            {idFirstIndex === "minimize" &&
                <img src={minusIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`minusButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            }
            {idFirstIndex === "close" &&
                <img src={closeIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`closeButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "play" &&
                <img src={playIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`playButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
            {/* {idFirstIndex === "checked" &&
                <img src={checkedIcon} data-tooltip-id={`tooltip-${id}`} alt={`${idSecondIndex}-icon`} className={`checkedButtonImageSize ${className}`} onClick={() => {
                    onClick();
                }} />
            } */}
        </>
    );
};

export default TooltipButton;

