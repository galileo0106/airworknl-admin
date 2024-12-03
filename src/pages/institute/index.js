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
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { apis } from "../../apis";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useSelector } from "react-redux";

const InstitutePage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const [institutes, setInstitutes] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const handleCloseDeleteDialog = () => {
    setSelectedRow(null);
    setOpenDialog({ ...openDialog, delete: false });
  };
  const columns = [
    { field: "name", headerName: "Institute name", type: "string", width: 300 },
    {
      field: "address",
      headerName: "Address",
      width: 300,
    },
    { field: "rating", headerName: "Rating", type: "number" },
    { field: "premium", headerName: "Premium", type: "boolean" },
    { field: "members_only", headerName: "Members only", type: "boolean" },
    {
      field: "founded_at",
      headerName: "Founded at",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Delete">
              <IconButton
                onClick={(e) => {
                  setSelectedRow(params.row);
                  setOpenDialog({ ...openDialog, delete: true });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={(e) => {
                  navigate(`/institute/${params.id}/edit`);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  navigate(`/institute/${params.id}/view?tab=overview`);
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
  const handleDeleteInstitute = async () => {
    try {
      var data;
      if (selectedRow) data = [selectedRow._id];
      else data = rowSelectionModel;
      await apis.deleteInstitutes(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const {
        data: { institutes },
      } = await apis.getInstitutes();
      setInstitutes(institutes);
    } catch (error) {}
  };

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Institutes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected institutes?
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
      <Card>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                {/* <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton> */}
                <Typography variant="h6">Manage Institutes</Typography>
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
                  onClick={() => navigate(`/institute/create`)}
                  startIcon={<AddIcon />}
                >
                  Create institute
                </Button>
              </Stack>
            </Stack>
            <Box height={600}>
              <DataGrid
                sx={{ height: "100%", width: "100%" }}
                localeText={{ noRowsLabel: "No institutes" }}
                rows={institutes}
                columns={columns}
                getRowId={(params) => params._id}
                scrollbarSize={3}
                checkboxSelection
                loading={isLoading}
                density="compact"
                slots={{ toolbar: GridToolbar }}
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
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InstitutePage;
