import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { apis } from "../../apis";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const [currentTab, setCurrentTab] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.common);
  const [rows, setRows] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });

  const handleChangeTab = (event, newValue) => {
    setSearchParams({ tab: newValue });
  };
  const handleCloseDeleteDialog = () => {
    setSelectedRow(null);
    setOpenDialog({ ...openDialog, delete: false });
  };
  const columns = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "level", headerName: "Level", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                setSelectedRow(params.row);
                setOpenDialog({ ...openDialog, delete: true });
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                navigate(`/category/${params.id}/edit?type=${currentTab}`);
              }}
            >
              <EditIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const handleDelete = async () => {
    try {
      var data;
      if (selectedRow) data = [selectedRow._id];
      else data = rowSelectionModel;
      await apis.deleteCategories(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentTab) init();
  }, [currentTab]);

  const init = async () => {
    try {
      const {
        data: { categories },
      } = await apis.getCategories(`?type=${currentTab}`);
      setRows(categories);
    } catch (error) {}
  };

  useEffect(() => {
    setCurrentTab(searchParams.get("tab"));
  }, [searchParams]);

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Categories</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected Categories?
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
      <Card sx={{ minHeight: 500 }}>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">Manage Categories</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setOpenDialog({ ...openDialog, delete: true });
                  }}
                  disabled={!rowSelectionModel.length}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(`/category/create?type=${currentTab}`)
                  }
                  startIcon={<AddIcon />}
                >
                  Create
                </Button>
              </Stack>
            </Stack>
            {currentTab && (
              <Box>
                <TabContext value={currentTab}>
                  <Box>
                    <TabList onChange={handleChangeTab}>
                      <Tab
                        label="Education"
                        value="education"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Certificate"
                        value="certificate"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Airplane"
                        value="airplane"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Simulator"
                        value="simulator"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="News and blog"
                        value="news_blog"
                        sx={{ textTransform: "none" }}
                      />
                    </TabList>
                  </Box>
                </TabContext>
                <DataGrid
                  sx={{ height: 500, width: "100%" }}
                  localeText={{ noRowsLabel: "No categories" }}
                  rows={rows}
                  columns={columns}
                  getRowId={(params) => params._id}
                  slots={{ toolbar: GridToolbar }}
                  scrollbarSize={3}
                  checkboxSelection
                  loading={isLoading}
                  density="compact"
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  pageSizeOptions={[20, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 20, page: 0 },
                    },
                  }}
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  disableRowSelectionOnClick
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoryPage;
