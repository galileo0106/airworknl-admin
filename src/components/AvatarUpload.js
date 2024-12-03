import { Button, Stack, Typography } from "@mui/material";
import ImagePreview from "./ImagePreview";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { apis } from "../apis";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const AvatarUpload = ({ avatar, setValue }) => {
  const handleImageUpload = async (event) => {
    try {
      const selectedImage = event.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedImage);
      const res = await apis.uploadImage("avatar", formData);
      setValue("avatar", res.data.image);
    } catch (error) {}
  };

  const handleDeleteAvatar = async (image) => {
    try {
      await apis.deleteImage(image);
      setValue("avatar", "");
    } catch (error) {}
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Avatar</Typography>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ width: "fit-content" }}
      >
        Upload avatar
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>

      {avatar && (
        <ImagePreview
          image={avatar}
          handleDelete={() => handleDeleteAvatar(avatar)}
        />
      )}
    </Stack>
  );
};


export default AvatarUpload;
