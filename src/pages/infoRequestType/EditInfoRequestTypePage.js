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
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { apis } from "../../apis";
import { INFO_REQUEST_TYPES } from "../../constants/constants";
import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const EditInfoRequestTypePage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [institutes, setInstitutes] = useState([]);
  const [educations, setEducations] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [simulators, setSimulators] = useState([]);
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
      types: [],
      premium_only: false,
      inactive_institutes: [],
      inactive_educations: [],
      inactive_airplanes: [],
      inactive_simulators: [],
    },
  });

  const handleEdit = async (data) => {
    try {
      await apis.updateInfoRequestType(id, data);
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
          data: { institutes, educations, airplanes, simulators },
        } = await apis.getInformationForRequestType();
        setInstitutes(institutes);
        setEducations(educations);
        setAirplanes(airplanes);
        setSimulators(simulators);
      } catch (error) {}
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            infoRequestType: {
              name,
              types,
              premium_only,
              inactive_institutes,
              inactive_educations,
              inactive_airplanes,
              inactive_simulators,
            },
          },
        } = await apis.getInfoRequestTypeById(id);
        setValue("name", name);
        setValue("types", types);
        setValue("premium_only", premium_only);
        setValue("inactive_institutes", inactive_institutes);
        setValue("inactive_educations", inactive_educations);
        setValue("inactive_airplanes", inactive_airplanes);
        setValue("inactive_simulators", inactive_simulators);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    if (!watch("types").includes("Institute")) {
      setValue("inactive_institutes", []);
    }
    if (!watch("types").includes("Education")) {
      setValue("inactive_educations", []);
    }
    if (!watch("types").includes("Airplane")) {
      setValue("inactive_airplanes", []);
    }
    if (!watch("types").includes("Simulator")) {
      setValue("inactive_simulators", []);
    }
  }, [watch("types")]);

  return (
    <Box>
      <Card>
        <CardHeader title="Edit info request type" />
        {!isLoading && (
          <CardContent>
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
                <Controller
                  name="types"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl fullWidth variant="standard">
                      <InputLabel>Types for</InputLabel>
                      <Select
                        multiple
                        label="Types for"
                        value={value}
                        onChange={onChange}
                      >
                        {INFO_REQUEST_TYPES.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="premium_only"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControl>
                      <RadioGroup value={value} onChange={onChange}>
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Global"
                        />
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Premium only"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {watch("types").length > 0 && (
                  <Typography variant="body1">Disable on</Typography>
                )}
                {watch("types").includes("Institute") && (
                  <Autocomplete
                    multiple
                    options={institutes}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    value={watch("inactive_institutes")}
                    onChange={(event, newValue) => {
                      setValue("inactive_institutes", newValue);
                    }}
                    renderOption={(props, option, { selected }) => {
                      const isSelected = watch("inactive_institutes").some(
                        (v) => v._id === option._id,
                      );
                      return (
                        <li
                          {...props}
                          onClick={() => {
                            var array = watch("inactive_institutes");
                            if (isSelected)
                              array = watch("inactive_institutes").filter(
                                (e) => e._id !== option._id,
                              );
                            else array.push(option);
                            setValue("inactive_institutes", array);
                          }}
                          style={{ height: 40 }}
                        >
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
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
                        label="Select institute"
                        placeholder="Institutes"
                      />
                    )}
                  />
                )}
                {watch("types").includes("Education") && (
                  <Autocomplete
                    multiple
                    options={educations}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    value={watch("inactive_educations")}
                    onChange={(event, newValue) => {
                      setValue("inactive_educations", newValue);
                    }}
                    renderOption={(props, option, { selected }) => {
                      const isSelected = watch("inactive_educations").some(
                        (v) => v._id === option._id,
                      );
                      return (
                        <li
                          {...props}
                          onClick={() => {
                            var array = watch("inactive_educations");
                            if (isSelected)
                              array = watch("inactive_educations").filter(
                                (e) => e._id !== option._id,
                              );
                            else array.push(option);
                            setValue("inactive_educations", array);
                          }}
                          style={{ height: 40 }}
                        >
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
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
                        label="Select educations"
                        placeholder="Educations"
                      />
                    )}
                  />
                )}
                {watch("types").includes("InstituteAirplane") && (
                  <Autocomplete
                    multiple
                    options={airplanes}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    value={watch("inactive_airplanes")}
                    onChange={(event, newValue) => {
                      setValue("inactive_airplanes", newValue);
                    }}
                    renderOption={(props, option, { selected }) => {
                      const isSelected = watch("inactive_airplanes").some(
                        (v) => v._id === option._id,
                      );
                      return (
                        <li
                          {...props}
                          onClick={() => {
                            var array = watch("inactive_airplanes");
                            if (isSelected)
                              array = watch("inactive_airplanes").filter(
                                (e) => e._id !== option._id,
                              );
                            else array.push(option);
                            setValue("inactive_airplanes", array);
                          }}
                          style={{ height: 40 }}
                        >
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
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
                        label="Select airplanes"
                        placeholder="Airplanes"
                      />
                    )}
                  />
                )}
                {watch("types").includes("InstituteSimulator") && (
                  <Autocomplete
                    multiple
                    options={simulators}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    value={watch("inactive_simulators")}
                    onChange={(event, newValue) => {
                      setValue("inactive_simulators", newValue);
                    }}
                    renderOption={(props, option, { selected }) => {
                      const isSelected = watch("inactive_simulators").some(
                        (v) => v._id === option._id,
                      );
                      return (
                        <li
                          {...props}
                          onClick={() => {
                            var array = watch("inactive_simulators");
                            if (isSelected)
                              array = watch("inactive_simulators").filter(
                                (e) => e._id !== option._id,
                              );
                            else array.push(option);
                            setValue("inactive_simulators", array);
                          }}
                          style={{ height: 40 }}
                        >
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
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
                        label="Select simulators"
                        placeholder="Simulators"
                      />
                    )}
                  />
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
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default EditInfoRequestTypePage;
