// src/components/JoditEditorComponent.jsx
import JoditEditor from 'jodit-react';
import { useRef } from 'react';

function Editor({ value, onChange }) {
  const editor = useRef(null);

    return (
      <>
    <JoditEditor
      ref={editor}
      value={value}
      config={{
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        height: 500,
        uploader: {
        insertImageAsBase64URI: true
        }
      }}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => onChange(newContent)} // preferred
      onChange={() => {}} // optional
            />
            {/* {value}
            <h3>HTML Output:</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          marginTop: '1rem',
          background: '#f9f9f9',
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      /> */}
            </>
  );
}

 export default Editor;
