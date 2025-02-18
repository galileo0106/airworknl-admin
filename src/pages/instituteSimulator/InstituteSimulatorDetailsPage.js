import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apis } from "../../apis";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSearchParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import InstituteSimulatorOverviewPage from "./InstituteSimulatorOverviewPage";
import InfoRequestPage from "../infoRequest";

const InstituteSimulatorDetailsPage = () => {
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [currentTab, setCurrentTab] = useState(null);
  const navigate = useNavigate();
  const { institute_id, institute_simulator_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const deleteForm = useForm();
  const [instituteSimulator, setInstituteSimulator] = useState(null);
  const [institute, setInstitute] = useState(null);

  const handleChangeTab = (event, newValue) => {
    if (newValue === "info_requests")
      setSearchParams({ tab: newValue, post_type: "InstituteSimulator" });
    else setSearchParams({ tab: newValue });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  const handleDelete = async () => {
    try {
      await apis.deleteInstituteSimulators(institute_simulator_id);
      setOpenDialog({ ...openDialog, delete: false });
      navigate(`/institute/${institute_id}/simulator`);
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    try {
      const {
        data: { instituteSimulator },
      } = await apis.getInstituteSimulatorById(institute_simulator_id);
      const {
        data: { institute },
      } = await apis.getInstituteById(institute_id);
      setInstituteSimulator(instituteSimulator);
      setInstitute(institute);
    } catch (error) {}
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchParams.get("tab")) setCurrentTab(searchParams.get("tab"));
    else {
      navigate(
        `/institute/${institute_id}/simulator/${institute_simulator_id}/view?tab=overview`,
      );
    }
  }, [searchParams, institute_id, institute_simulator_id]);
  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete instituteSimulator</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will delete all related information to this instituteSimulator
            forever.
            <br />
            Are you sure to delete this instituteSimulator?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDelete)}
          >
            <Button variant="text" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              type="submit"
              loading={deleteForm.formState.isSubmitting}
            >
              Delete
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
      {instituteSimulator && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack spacing={2} justifyContent="space-between">
                <Breadcrumbs separator="›">
                  <Link
                    variant="h6"
                    onClick={() => navigate("/institute")}
                    sx={{ cursor: "pointer" }}
                  >
                    Institutes
                  </Link>
                  <Link
                    variant="h6"
                    onClick={() =>
                      navigate(`/institute/${institute_id}/view?tab=overview`)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    {institute.name}
                  </Link>
                  <Link
                    variant="h6"
                    onClick={() =>
                      navigate(`/institute/${institute_id}/view?tab=simulators`)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    Simulators
                  </Link>
                  <Typography variant="h6">
                    {instituteSimulator.simulator.name}
                  </Typography>
                  <Typography variant="h6">{currentTab}</Typography>
                </Breadcrumbs>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={(e) => {
                      setOpenDialog({ ...openDialog, delete: true });
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      navigate(
                        `/institute/${institute_id}/simulator/${institute_simulator_id}/edit`,
                      )
                    }
                  >
                    Edit simulator
                  </Button>
                </Stack>
              </Stack>
              <TabContext value={currentTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChangeTab}>
                    <Tab
                      label="Overview"
                      value="overview"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Information requests"
                      value="info_requests"
                      sx={{ textTransform: "none" }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="overview" sx={{ p: 0 }}>
                  <InstituteSimulatorOverviewPage
                    instituteSimulator={instituteSimulator}
                  />
                </TabPanel>
                <TabPanel value="info_requests" sx={{ p: 0 }}>
                  <InfoRequestPage />
                </TabPanel>
              </TabContext>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InstituteSimulatorDetailsPage;
