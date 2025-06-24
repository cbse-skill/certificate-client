import { useRef, useState } from "react";
import "./dragAndDrop.css";
function DragDropFile({
  handleUpload,
  children,
  type,
  filename,
  className = "file-upload",
  title = "Drag And Drop File",
}) {
  const [dragActive, setDragActive] = useState(false);
  const id = `input-${Math.random()}`;
  const inputRef = useRef(null);

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
    e.target.value = null;
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    let files;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      files = e.dataTransfer.files;
      handleUpload(e.dataTransfer.files?.[0]);
    }
    e.target.value = null;
  };

  const handleChange = function (e) {
    e.preventDefault();
    let files;
    if (e.target.files && e.target.files[0]) {
      files = e.target.files;
      handleUpload(e.target.files[0]);
    }
    e.target.value = null;
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form
      // id="form-file-upload"
      className={`form-file-upload ${className}`}
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id={id}
        className="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className={
          dragActive ? "drag-active label-file-upload" : "label-file-upload"
        }
      >
        <div>
          <a className="dragRef">{title}</a>
          <small className="format">
            <br />
            {/* .Docx, .Xls, .Pdf, .Pptx, .Jpeg (Less then 5mb) */}
            {type}
          </small>
          {filename && (
            <div className="downloadedFile">
              <p>{filename}</p>
            </div>
          )}
        </div>
      </label>
      {dragActive && (
        <div
          className="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {children}
        </div>
      )}
    </form>
  );
}

export default DragDropFile;
