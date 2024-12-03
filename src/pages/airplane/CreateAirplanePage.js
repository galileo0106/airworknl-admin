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
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const CreateAirplanePage = () => {
  const [categories, setCategories] = useState([]);
  const [airplaneTypes, setAirplaneTypes] = useState([]);
  const [airplaneModels, setAirplaneModels] = useState([]);
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
  const handleCreate = async (data) => {
    try {
      await apis.createAirplane(data);
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
        } = await apis.getCategories("?type=airplane");
        setCategories(categories);
        const {
          data: { airplaneTypes },
        } = await apis.getAirplaneTypes();
        setAirplaneTypes(airplaneTypes);
      } catch (error) {}
    };
    init();
  }, []);

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
        <CardHeader title="Create airplane" />
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
                  {...register("max_speed", {
                    required: "This Field is required",
                  })}
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

export default CreateAirplanePage;
