import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReactQuill from "react-quill";
import TextEditor from "../../components/TextEditor";

const CreateCertificatePage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      categories: [],
      price: 0,
    },
  });
  const handleCreate = async (data) => {
    try {
      await apis.createCertificate(data);
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
        } = await apis.getCategories("?type=certificate");
        setCategories(categories);
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardHeader title="Create certificate" />
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
              <TextField label="Code" {...register("code")} />
              <Box height="fit-content" pt={2}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextEditor
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
              <TextField label="Price" {...register("price")} type="number" />
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

export default CreateCertificatePage;
