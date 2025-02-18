import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
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
import { useEffect, useState } from "react";

const CreateAdmissionSelectionPage = () => {
  const [educations, setEducations] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      education_id: "",
      funding: "",
      education: "",
      medical: "",
    },
  });
  const handleCreate = async (data) => {
    try {
      await apis.createAdmissionSelection(data);
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
          data: { educations },
        } = await apis.getEducations();
        setEducations(educations);
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardHeader title="Create adminssion & selection" />
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
              <Controller
                name="education_id"
                control={control}
                rules={{
                  required: "This field is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={educations}
                    getOptionLabel={(option) => (option ? option.name : "")}
                    value={watch("education_id")}
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
                        label="Select education"
                        error={!!errors.education_id}
                        helperText={errors.education_id?.message}
                      />
                    )}
                  />
                )}
              />
              <TextField
                label="Funding"
                {...register("funding")}
                multiline
                rows={4}
              />
              <TextField
                label="Education"
                {...register("education")}
                multiline
                rows={4}
              />
              <TextField
                label="Medical"
                {...register("medical")}
                multiline
                rows={4}
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

export default CreateAdmissionSelectionPage;
