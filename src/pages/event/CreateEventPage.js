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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const handleCreate = async (data) => {
    try {
      await apis.createEvent(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader title="Create event" />
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

export default CreateEventPage;
