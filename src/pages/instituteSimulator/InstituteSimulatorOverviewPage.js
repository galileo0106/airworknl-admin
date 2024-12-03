import { Checkbox, Chip, Divider, Rating, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import QuillContent from "../../components/QuillContent";
import ImagePreview from "../../components/ImagePreview";

const InstituteSimulatorOverviewPage = ({ instituteSimulator }) => {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="h6">Simulator information</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Price (€/hr):
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.price_per_hour}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Departments:
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.departments.map((department, index) => (
              <Chip label={department.name} key={`department-${index}`} />
            ))}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <QuillContent content={instituteSimulator.description} />
        </Stack>
        {instituteSimulator?.images.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" fontWeight={500} minWidth={120}>
              Images:
            </Typography>
            <Stack direction="row" spacing={2}>
              {instituteSimulator?.images.map((image, index) => (
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
            {instituteSimulator.simulator.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Type:
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.simulator.type.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Model:
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.simulator.model}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Categories:
          </Typography>
          {instituteSimulator.simulator.categories.map((e, index) => (
            <Chip label={e?.name || ""} key={`category-${index}`} />
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <QuillContent content={instituteSimulator.simulator.description} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Create at:
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.simulator.created_at}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Updated at:
          </Typography>
          <Typography variant="body2">
            {instituteSimulator.simulator.updated_at}
          </Typography>
        </Stack>
        {instituteSimulator?.simulator.images.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" fontWeight={500} minWidth={120}>
              Images:
            </Typography>
            <Stack direction="row" spacing={2}>
              {instituteSimulator.simulator?.images.map((image, index) => (
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
            {JSON.parse(instituteSimulator?.metadata).title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Description:
          </Typography>
          <Typography variant="body2">
            {JSON.parse(instituteSimulator?.metadata).description}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={500} minWidth={120}>
            Slug:
          </Typography>
          <Typography variant="body2">{instituteSimulator?.slug}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default InstituteSimulatorOverviewPage;
