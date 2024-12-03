import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const EditAirplanePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [airplaneTypes, setAirplaneTypes] = useState([]);
  const [airplaneModels, setAirplaneModels] = useState([]);
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
      categories: [],
      images: [],
      type: "",
      model: "",
      max_speed: "",
      max_range: "",
      useful_load: "",
      passengers: "",
    },
  });
  const handleEdit = async (data) => {
    try {
      await apis.updateAirplane(id, data);
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
            airplane: {
              name,
              description,
              categories,
              images,
              type,
              model,
              max_speed,
              max_range,
              useful_load,
              passengers,
            },
          },
        } = await apis.getAirplaneById(id);
        setValue("name", name);
        setValue("description", description);
        setValue("categories", categories);
        setValue("type", type);
        setValue("model", model);
        setValue("images", images || []);
        setValue("max_speed", max_speed);
        setValue("max_range", max_range);
        setValue("useful_load", useful_load);
        setValue("passengers", passengers);
        setAirplaneModels(type.models);
        const {
          data: { categories: data },
        } = await apis.getCategories("?type=airplane");
        setCategories(data);
        const {
          data: { airplaneTypes },
        } = await apis.getAirplaneTypes();
        setAirplaneTypes(airplaneTypes);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [setValue, id]);

  useEffect(() => {
    if (watch("type")) {
      if (!watch("type")?.models.includes(watch("model")))
        setValue("model", "");
      setAirplaneModels(watch("type")?.models);
    }
  }, [watch("type")]);

  return (
    <Box>
      <Card>
        <CardHeader title="Edit airplane" />
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
                      renderOption={(props, option, { selected }) => {
                        const isSelected = watch("categories").some(
                          (v) => v._id === option._id
                        );
                        return (
                          <li
                            {...props}
                            onClick={() => {
                              var array = watch("categories");
                              if (isSelected)
                                array = watch("categories").filter(
                                  (e) => e._id !== option._id
                                );
                              else array.push(option);
                              setValue("categories", array);
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
                  name="type"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={airplaneTypes}
                      getOptionLabel={(option) => (option ? option.name : "")}
                      value={watch("type")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type"
                          error={!!errors.type}
                          helperText={errors.type?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="model"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={airplaneModels}
                      getOptionLabel={(option) => (option ? option : "")}
                      value={watch("model")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          {option}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Model"
                          error={!!errors.model}
                          helperText={errors.model?.message}
                        />
                      )}
                    />
                  )}
                />
                <FormControl variant="standard">
                  <Typography variant="body1">Max speed</Typography>
                  <Input
                    endAdornment={
                      <InputAdornment position="end">kts</InputAdornment>
                    }
                    {...register("max_speed")}
                    type="number"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <Typography variant="body1">Max range</Typography>
                  <Input
                    endAdornment={
                      <InputAdornment position="end">nm</InputAdornment>
                    }
                    {...register("max_range")}
                    type="number"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <Typography variant="body1">Useful load</Typography>
                  <Input
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                    {...register("useful_load")}
                    type="number"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <Typography variant="body1">Passengers</Typography>
                  <Input
                    endAdornment={
                      <InputAdornment position="end">seat</InputAdornment>
                    }
                    {...register("passengers")}
                    type="number"
                  />
                </FormControl>
                <DragDropImages
                  imageType="airplane"
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

export default EditAirplanePage;
