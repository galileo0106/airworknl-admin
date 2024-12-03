import { Checkbox, Chip, Divider, Rating, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import QuillContent from "../../components/QuillContent";
import ImagePreview from "../../components/ImagePreview";

const InstituteAirplaneOverviewPage = ({ instituteAirplane }) => {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="h6">Airplane information</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Price (€/hr):
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.price_per_hour}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Registration:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane?.registration || ""}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Departments:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.departments.map((department, index) => (
              <Chip label={department.name} key={`department-${index}`} />
            ))}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <QuillContent content={instituteAirplane.description} />
        </Stack>
        {instituteAirplane?.images.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" fontWeight={500} minWidth={120}>
              Images:
            </Typography>
            <Stack direction="row" spacing={2}>
              {instituteAirplane?.images.map((image, index) => (
                <ImagePreview
                  image={image}
                  key={`preview-image-${index}`}
                  hideDeleteBtn
                />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
      <Divider />
      <Stack spacing={1}>
        <Typography variant="h6">Basic information</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Name:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.airplane.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Type:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.airplane.type.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Model:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.airplane.model}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Categories:
          </Typography>
          {instituteAirplane.airplane.categories.map((e, index) => (
            <Chip label={e?.name || ""} key={`category-${index}`} />
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <QuillContent content={instituteAirplane.airplane.description} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Create at:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.airplane.created_at}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Updated at:
          </Typography>
          <Typography variant="body2">
            {instituteAirplane.airplane.updated_at}
          </Typography>
        </Stack>
        {instituteAirplane?.airplane.images.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" fontWeight={500} minWidth={120}>
              Images:
            </Typography>
            <Stack direction="row" spacing={2}>
              {instituteAirplane.airplane?.images.map((image, index) => (
                <ImagePreview
                  image={image}
                  key={`preview-image-${index}`}
                  hideDeleteBtn
                />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
      <Divider />

      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Typography variant="h6">Seo medadata</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Title:
          </Typography>
          <Typography variant="body2">
            {JSON.parse(instituteAirplane?.metadata).title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <Typography variant="body2">
            {JSON.parse(instituteAirplane?.metadata).description}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Slug:
          </Typography>
          <Typography variant="body2">{instituteAirplane?.slug}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default InstituteAirplaneOverviewPage;
