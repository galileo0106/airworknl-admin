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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

const EditCategoryPage = () => {
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
      type: "",
      level: 10,
    },
  });
  const handleEdit = async (data) => {
    try {
      await apis.updateCategory(id, data);
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
            category: {
              name,
              type,
              description,
              slug,
              images = [],
              level,
              add_to_homepage,
            },
          },
        } = await apis.getCategoryById(id);
        setValue("name", name);
        setValue("description", description);
        setValue("images", images || []);
        setValue("slug", slug || "");
        setValue("type", type);
        setValue("level", level);
        setValue("add_to_homepage", add_to_homepage);
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
        <CardHeader title="Edit category" />
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
                <TextField
                  select
                  label="Category type"
                  defaultValue={watch("type")}
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

export default EditCategoryPage;
