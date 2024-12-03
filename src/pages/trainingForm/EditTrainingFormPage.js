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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import DragDropImages from "../../components/DragDropImages";
import ReactQuill from "react-quill";

const EditTrainingFormPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      slug: "",
    },
  });
  const handleEdit = async (data) => {
    try {
      await apis.updateTrainingForm(id, data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            training_form: { name, description, images, slug },
          },
        } = await apis.getTrainingFormById(id);
        setValue("name", name);
        setValue("description", description);
        setValue("images", images || []);
        setValue("slug", slug || "");
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [setValue, id]);

  return (
    <Box>
      <Card>
        <CardHeader title="Edit training form" />
        <CardContent>
          {!isLoading && (
            <Stack direction="row" spacing={2}>
              <Stack
                direction="column"
                maxWidth={700}
                width="100%"
                spacing={2}
                component="form"
                onSubmit={handleSubmit(handleEdit)}
              >
                <TextField
                  label="Name"
                  {...register("name", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.name?.message}
                  error={!!errors.name}
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
                  imageType="training_form"
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
                    Update
                  </LoadingButton>
                </Stack>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditTrainingFormPage;
