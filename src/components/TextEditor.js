// src/components/TextEditor.jsx
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ResizeModule from "@botom/quill-resize-module";

// Register the resize module
Quill.register("modules/resize", ResizeModule);

const TextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // headers
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        // [{ font: [] }], // font family
        [{ align: [] }], // text align
        ["link", "image", "video"], // media
        ["clean"] // remove formatting button
      ]
    },
    resize: {
      locale: {} // configuration options for the resize module (if any)
    }
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "script",
    "color",
    "background",
    // "font",
    "align",
    "link",
    "image",
    "video"
  ];

  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      theme="snow"
    />
  );
};

export default TextEditor;
