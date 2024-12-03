import { Stack, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";

const EditableTextfield = ({ text, onSave, label }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onSave(editedText); // Save the edited text
  };

  return (
    <div>
      {isEditing ? (
        <Stack direction="row" spacing={1}>
          {label && (
            <Typography
              variant="body1"
              sx={{ minWidth: 120, textTransform: "capitalize" }}
              fontWeight={600}
            >
              {label}:
            </Typography>
          )}
          <TextField
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            fullWidth
          />
        </Stack>
      ) : (
        <Stack
          onDoubleClick={handleDoubleClick}
          direction="row"
          spacing={1}
          alignItems="flex-start"
        >
          {label && (
            <Typography
              variant="body1"
              sx={{ minWidth: 120, textTransform: "capitalize" }}
              fontWeight={600}
            >
              {label}:
            </Typography>
          )}
          <Typography variant="body1">{text}</Typography>
          <EditIcon onClick={handleDoubleClick} sx={{ fontSize: 15 }} />
        </Stack>
      )}
    </div>
  );
};

export default EditableTextfield;
