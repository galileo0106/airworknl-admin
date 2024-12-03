import { Box, IconButton, useTheme } from "@mui/material";
import { getImageUrl } from "../utils";
import DeleteIcon from "@mui/icons-material/Delete";

const ImagePreview = ({
  image,
  width = 150,
  height = 100,
  handleDelete,
  hideDeleteBtn = false,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundImage: `url("${getImageUrl(image)}")`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: width,
        height: height,
        position: "relative",
      }}
    >
      {!hideDeleteBtn && (
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translate(50%, -50%)",
          }}
          color="error"
          onClick={handleDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ImagePreview;
