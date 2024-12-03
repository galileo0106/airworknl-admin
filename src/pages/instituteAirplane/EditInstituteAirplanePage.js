import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import QuillContent from "../../components/QuillContent";
import DragDropImages from "../../components/DragDropImages";
import ReactQuill from "react-quill";
import ImagePreview from "../../components/ImagePreview";

const EditInstituteAirplanePage = () => {
  const [loaded, setLoaded] = useState(false);
  const { institute_id, institute_airplane_id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [types, setTypes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
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
      airplane: "",
      description: "",
      institute: institute_id,
      price_per_hour: 0,
      registration: "",
      departments: [],
      images: [],
      metadata: {
        title: "",
        description: "",
      },
      slug: "",
    },
  });
  const handleUpdate = async (data) => {
    try {
      data.metadata = JSON.stringify(data.metadata);
      await apis.updateInstituteAirplane(institute_airplane_id, data);
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
          data: {
            instituteAirplane: {
              _id,
              airplane,
              description,
              departments,
              registration,
              images,
              price_per_hour,
              metadata,
              slug,
            },
          },
        } = await apis.getInstituteAirplaneById(institute_airplane_id);
        setValue("airplane", airplane);
        setValue("description", description);
        setValue("departments", departments);
        setValue("images", images || []);
        setValue("price_per_hour", price_per_hour);
        setValue("registration", registration);
        setValue("metadata", JSON.parse(metadata));
        setValue("slug", slug || "");
        setSelectedType(airplane.type);
        setSelectedModel(airplane.model);
        const {
          data: { airplaneTypes },
        } = await apis.getAirplaneTypes();
        setTypes([...airplaneTypes]);
      } catch (error) {
      } finally {
        setLoaded(true);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (selectedType) {
      if (!selectedType.models.includes(selectedModel)) {
        setSelectedModel("");
      }
      setModels([...selectedType.models]);
    }
  }, [selectedType]);

  useEffect(() => {
    const init = async () => {
      try {
        const query = `?type=${selectedType._id || ""}&model=${selectedModel}`;
        const {
          data: { airplanes },
        } = await apis.getAirplanes(query);
        setAirplanes(airplanes);
        let flag = true;
        airplanes.forEach((airplane) => {
          if (String(airplane._id) === String(watch("airplane")._id)) {
            flag = false;
          }
        });
        if (flag) {
          setValue("airplane", "");
        }
      } catch (error) {}
    };
    if (selectedType !== "" && selectedModel !== "") init();
  }, [selectedType, selectedModel]);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { departments },
        } = await apis.getDepartments(`?institutes=${institute_id}`);
        setDepartments(departments);
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardContent>
          {loaded && (
            <Stack direction="row" spacing={2}>
              <Stack
                direction="column"
                maxWidth={700}
                width="100%"
                spacing={4}
                component="form"
                onSubmit={handleSubmit(handleUpdate)}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <Typography variant="h6">Edit airplane</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Autocomplete
                    options={types}
                    getOptionLabel={(option) => (option ? option?.name : "")}
                    value={selectedType}
                    onChange={(event, newValue) => {
                      setSelectedType(newValue);
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ height: 40 }}>
                        {option?.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Type" />
                    )}
                  />
                  <Autocomplete
                    options={models}
                    getOptionLabel={(option) => (option ? option : "")}
                    value={selectedModel}
                    onChange={(event, newValue) => {
                      setSelectedModel(newValue);
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ height: 40 }}>
                        {option}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Model" />
                    )}
                  />
                  <Controller
                    name="airplane"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={airplanes}
                        getOptionLabel={(option) => option?.name || ""}
                        value={watch("airplane")}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ height: 40 }}>
                            {option?.name || ""}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select airplane"
                            placeholder="Airplane"
                            error={!!errors.airplane}
                            helperText={errors.airplane?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <TextField
                    type="number"
                    label="Price per hour"
                    {...register("price_per_hour")}
                  />
                  <TextField
                    label="Registration"
                    {...register("registration")}
                  />
                  <Controller
                    name="departments"
                    control={control}
                    rules={{ required: "This field is required" }}
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
                            (v) => v._id === option._id
                          );
                          return (
                            <li
                              {...props}
                              onClick={() => {
                                var array = watch("departments");
                                if (isSelected)
                                  array = watch("departments").filter(
                                    (e) => e._id !== option._id
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
                            error={!!errors?.departments}
                            helperText={errors?.departments?.message}
                          />
                        )}
                      />
                    )}
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
                  <Stack spacing={1}>
                    <Typography variant="h6">Seo metadata</Typography>
                    <TextField label="Title" {...register("metadata.title")} />
                    <TextField
                      label="Description"
                      {...register("metadata.description")}
                    />
                    <TextField label="Slug" {...register("slug")} />
                  </Stack>
                </Stack>
                <DragDropImages
                  imageType="institute_airplane"
                  watch={watch}
                  setValue={setValue}
                />
                <Divider />
                {watch("airplane") && (
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Name:
                      </Typography>
                      <Typography variant="body1">
                        {watch("airplane").name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Description:
                      </Typography>
                      <QuillContent content={watch("airplane").description} />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Created at:
                      </Typography>
                      <Typography variant="body1">
                        {watch("airplane").created_at}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Updated at:
                      </Typography>
                      <Typography variant="body1">
                        {watch("airplane").updated_at}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Stock images:
                      </Typography>
                      <Box display="flex" gap={2}>
                        {watch("airplane").images.map((image, index) => (
                          <ImagePreview image={image} hideDeleteBtn />
                        ))}
                      </Box>
                    </Stack>
                  </Stack>
                )}

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

export default EditInstituteAirplanePage;
