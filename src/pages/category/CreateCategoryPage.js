import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apis } from "../../apis";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const categoryTypes = [
  {
    label: "Education",
    value: "education",
  },
  {
    label: "Certificate",
    value: "certificate",
  },
  {
    label: "Airplane",
    value: "airplane",
  },
  {
    label: "Simulator",
    value: "simulator",
  },
  {
    label: "News and blog",
    value: "news_blog",
  },
];

const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
      type: searchParams.get("type"),
      level: 10,
    },
  });
  const handleCreate = async (data) => {
    try {
      await apis.createCategory(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader title="Create Category" />
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
              <TextField
                select
                label="Category type"
                defaultValue={searchParams.get("type")}
                {...register("type")}
              >
                {categoryTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
              {watch("type") === "education" && (
                <Controller
                  name="add_to_homepage"
                  defaultValue={false}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      label="Assgin to homepage"
                    />
                  )}
                />
              )}
              <DragDropImages
                imageType="category"
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

export default CreateCategoryPage;
