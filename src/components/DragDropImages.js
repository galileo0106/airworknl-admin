import { Box, Button, Stack, Typography } from "@mui/material";
import ImagePreview from "./ImagePreview";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { apis } from "../apis";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DragDropImages = ({ watch, setValue, imageType }) => {
  let images = watch("images") || [];
  const handleImageUpload = async (event) => {
    try {
      const selectedImage = event.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedImage);
      const res = await apis.uploadImage(imageType, formData);
      images.push(res.data.image);
      setValue("images", images || []);
    } catch (error) {}
  };

  const handleDeleteImage = async (image) => {
    try {
      const res = await apis.deleteImage(image);
      images = images.filter((e) => e !== image);
      setValue("images", images || []);
    } catch (error) {}
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      images,
      result.source.index,
      result.destination.index
    );
    setValue("images", items);

    // Here you would also call a function to update the order in your backend
    // apis.updateImageOrder(items.map(item => item.id));
  };
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Images</Typography>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ width: "fit-content" }}
      >
        Upload image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-images" direction="horizontal">
          {(provided) => (
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              ref={provided.innerRef}
              {...provided.droppableProps}
              py={2}
              sx={{ overflowX: "auto" }}
            >
              {images.map((image, index) => (
                <Draggable key={image} draggableId={image} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ImagePreview
                        image={image}
                        handleDelete={() => handleDeleteImage(image)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
};

export default DragDropImages;
