import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const CreateInstituteTypePage = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      slug: "",
      level: 10,
    },
  });
  const handleCreate = async (data) => {
    try {
      await apis.createInstituteType(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader title="Create institute type" />
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Stack
              direction="column"
              maxWidth={700}
              width="100%"
              spacing={2}
              component="form"
              onSubmit={handleSubmit(handleCreate)}
            >
              <TextField
                label="Name"
                {...register("name", {
                  required: "This Field is required",
                })}
                helperText={errors?.name?.message}
                error={!!errors.name}
              />
              <TextField
                label="Level"
                {...register("level", {
                  required: "This Field is required",
                })}
                type="number"
                inputProps={{ step: 0 }}
                helperText={errors?.level?.message}
                error={!!errors.level}
              />
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
                imageType="institute_type"
                watch={watch}
                setValue={setValue}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="text"
                  onClick={() => navigate(-1)}
                  sx={{ width: "fit-content" }}
                >
                  Go back
                </Button>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                  sx={{ width: "fit-content" }}
                >
                  Create
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateInstituteTypePage;
