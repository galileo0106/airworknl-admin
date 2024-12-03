import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { apis } from "../../apis";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import ReactQuill from "react-quill";
import DragDropImages from "../DragDropImages";

const CreateAirplaneTypeDialog = ({ open, onClose, getAirplaneTypes }) => {
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      models: [],
      description: "",
      images: [],
      slug: "",
    },
  });
  const [model, setModel] = useState("");
  const handleCreate = async (data) => {
    try {
      await apis.createAirplaneType(data);
      reset();
      setModel("");
      onClose();
      getAirplaneTypes();
    } catch (error) {}
  };
  const handleCancel = () => {
    reset();
    setModel("");
    onClose();
  };
  const handleAddModel = () => {
    if (model) {
      let models = watch("models");
      models.push(model);
      setValue("models", models);
      setModel("");
    }
  };
  const handleDeleteModel = (model) => (event) => {
    let models = watch("models");
    models = models.filter((e) => e !== model);
    setValue("models", models);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Create a airplane type</DialogTitle>
      <DialogContent>
        <Stack
          spacing={1}
          component="form"
          onSubmit={handleSubmit(handleCreate)}
        >
          <TextField
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors?.name?.message || " "}
          />
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              label="Model"
              placeholder="Type model here"
              fullWidth
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <Button
              variant="outlined"
              sx={{ width: "fit-content" }}
              startIcon={<AddIcon />}
              size="small"
              onClick={handleAddModel}
            >
              Add
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="body1" fontWeight={600}>
              Models:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {watch("models").map((model, index) => (
                <Chip
                  label={model}
                  key={`model-${index}`}
                  onDelete={handleDeleteModel(model)}
                  onClick={handleDeleteModel(model)}
                />
              ))}
            </Box>
          </Stack>
          <Box height="fit-content" pt={2}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  placeholder="Type description here"
                  theme="snow"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Box>
          <TextField label="Slug" {...register("slug")} />
          <DragDropImages
            imageType="airplane_type"
            watch={watch}
            setValue={setValue}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="text" onClick={handleCancel}>
              Cancel
            </Button>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              type="submit"
            >
              Create
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAirplaneTypeDialog;
