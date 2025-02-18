import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { languages } from "../../constants/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const CreateEducationPage = () => {
  const { institute_id } = useParams();
  const [categories, setCategories] = useState([]);
  const [trainingForms, setTrainingForms] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();
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
      code: "",
      images: [],
      description: "",
      categories: [],
      languages: [],
      training_forms: [],
      funding: false,
      price: 0,
      premium: false,
      institute: institute_id,
      departments: [],
      metadata: {
        title: "",
        description: "",
        slug: "",
      },
    },
  });
  const handleCreate = async (data) => {
    try {
      let temp = [];
      data.metadata.slug = data.slug;
      data.languages.forEach((e) => {
        temp.push(JSON.stringify(e));
      });
      data.languages = temp;
      data.metadata = JSON.stringify(data.metadata);
      await apis.createEducation(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { categories },
        } = await apis.getCategories("?type=education");
        setCategories(categories);
        const {
          data: { training_forms },
        } = await apis.getTrainingForms();
        setTrainingForms(training_forms);
        const {
          data: { departments },
        } = await apis.getDepartments(`?institutes=${institute_id}`);
        setDepartments(departments);
      } catch (error) {}
    };

    init();
  }, [institute_id]);

  useEffect(() => {
    if (departments.length > 0) setValue("departments", [departments[0]]);
  }, [departments]);

  return (
    <Box>
      <Card>
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
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">Create education</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Basic information</Typography>
                <TextField
                  label="Name"
                  {...register("name", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.name?.message}
                  error={!!errors.name}
                />
                <Controller
                  name="departments"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "Please select at least 1 department",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={departments}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      value={watch("departments")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => {
                        const isSelected = watch("departments").some(
                          (v) => v._id === option._id,
                        );
                        return (
                          <li
                            {...props}
                            onClick={() => {
                              var array = watch("departments");
                              if (isSelected)
                                array = watch("departments").filter(
                                  (e) => e._id !== option._id,
                                );
                              else array.push(option);
                              setValue("departments", array);
                            }}
                            style={{ height: 40 }}
                          >
                            <Checkbox
                              icon={
                                <CheckBoxOutlineBlankIcon fontSize="small" />
                              }
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              style={{ marginRight: 8 }}
                              checked={isSelected}
                            />
                            {option.name}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select departments"
                          placeholder="department"
                          error={!!errors.departments}
                          helperText={errors.departments?.message}
                        />
                      )}
                    />
                  )}
                />
                <TextField label="Code" {...register("code")} />
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
                <Controller
                  name="categories"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "Please select at least 1 category",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={categories}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      value={watch("categories")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select categories"
                          placeholder="Category"
                          error={!!errors.categories}
                          helperText={errors.categories?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="languages"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "Please select at least 1 language",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={languages}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      value={watch("languages")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select languages"
                          placeholder="Language"
                          error={!!errors.languages}
                          helperText={errors.languages?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="training_forms"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 ||
                      "Please select at least 1 training form",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={trainingForms}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      value={watch("training_forms")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select training forms"
                          placeholder="Training form"
                          error={!!errors.training_forms}
                          helperText={errors.training_forms?.message}
                        />
                      )}
                    />
                  )}
                />
                <TextField label="Price" {...register("price")} type="number" />
                <Controller
                  name="funding"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      label="Funding"
                    />
                  )}
                />
                <Controller
                  name="premium"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      label="Premium"
                    />
                  )}
                />
              </Stack>
              <DragDropImages
                imageType="education"
                watch={watch}
                setValue={setValue}
              />
              <Stack spacing={1}>
                <Typography variant="h6">Seo metadata</Typography>
                <TextField label="Title" {...register("metadata.title")} />
                <TextField
                  label="Description"
                  {...register("metadata.description")}
                />
                <TextField label="Slug" {...register("slug")} />
              </Stack>

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

export default CreateEducationPage;
