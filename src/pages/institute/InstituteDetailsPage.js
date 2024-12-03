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
import InstituteOverviewPage from "./InstituteOverviewPage";
import DepartmentPage from "../department";
import EducationPage from "../education";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import InstituteAirplanePage from "../instituteAirplane";
import InstituteSimulatorPage from "../instituteSimulator";
import InstituteReviewPage from "../instituteReview";
import InfoRequestPage from "../infoRequest";

const InstituteDetailsPage = () => {
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [currentTab, setCurrentTab] = useState(null);
  const navigate = useNavigate();
  const { institute_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const deleteForm = useForm();
  const [institute, setInstitute] = useState(null);

  const handleChangeTab = (event, newValue) => {
    if (newValue === "info_requests")
      setSearchParams({ tab: newValue, post_type: "Institute" });
    else setSearchParams({ tab: newValue });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  const handleDeleteInstitute = async () => {
    try {
      await apis.deleteInstitutes(institute_id);
      setOpenDialog({ ...openDialog, delete: false });
      navigate("/institute");
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    try {
      const {
        data: { institute },
      } = await apis.getInstituteById(institute_id);
      setInstitute(institute);
    } catch (error) {}
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [institute_id]);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setCurrentTab(searchParams.get("tab"));
    } else {
      navigate(`/institute/${institute_id}/view?tab=overview`);
    }
  }, [searchParams, institute_id]);
  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Institute</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will delete all related information to this institute forever.
            <br />
            Are you sure to delete this institute?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteInstitute)}
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
      {institute && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Breadcrumbs separator="›">
                  <Link
                    variant="h6"
                    onClick={() => navigate("/institute")}
                    sx={{ cursor: "pointer" }}
                  >
                    Institutes
                  </Link>
                  <Typography variant="h6">{institute.name}</Typography>
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
                    onClick={() => navigate(`/institute/${institute_id}/edit`)}
                  >
                    Edit institute
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
                      label="Departments"
                      value="departments"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Educations"
                      value="educations"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Airplanes"
                      value="airplanes"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Simulators"
                      value="simulators"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Reviews"
                      value="reviews"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Information requests"
                      value="info_requests"
                      sx={{ textTransform: "none" }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="overview">
                  <InstituteOverviewPage institute={institute} />
                </TabPanel>
                <TabPanel value="departments" sx={{ p: 0 }}>
                  <DepartmentPage />
                </TabPanel>
                <TabPanel value="educations" sx={{ p: 0 }}>
                  <EducationPage />
                </TabPanel>
                <TabPanel value="airplanes" sx={{ p: 0 }}>
                  <InstituteAirplanePage />
                </TabPanel>
                <TabPanel value="simulators" sx={{ p: 0 }}>
                  <InstituteSimulatorPage />
                </TabPanel>
                <TabPanel value="reviews" sx={{ p: 0 }}>
                  <InstituteReviewPage />
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

export default InstituteDetailsPage;
