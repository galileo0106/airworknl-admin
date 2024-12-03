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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { apis } from "../../apis";
import { useSelector } from "react-redux";
import CreateAirplaneTypeDialog from "../../components/dialogs/CreateAirplaneTypeDialog";
import EditAirplaneTypeDialog from "../../components/dialogs/EditAirplaneTypeDialog";

const AirplaneTypePage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const [rows, setRows] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
    create: false,
    edit: false,
  });
  const handleCloseDeleteDialog = () => {
    setSelectedRow(null);
    setOpenDialog({ ...openDialog, delete: false });
  };
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
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
              onClick={() => {
                setSelectedRow(params.row);
                setOpenDialog({ ...openDialog, edit: true });
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
      await apis.deleteAirplaneTypes(data.join());
      getAirplaneTypes();
      setOpenDialog({ ...openDialog, delete: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAirplaneTypes();
  }, []);

  const getAirplaneTypes = async () => {
    try {
      const {
        data: { airplaneTypes },
      } = await apis.getAirplaneTypes();
      setRows([...airplaneTypes]);
    } catch (error) {}
  };

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete airplanes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected airplane types?
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
      <CreateAirplaneTypeDialog
        open={openDialog.create}
        onClose={() => {
          setOpenDialog({ ...openDialog, create: false });
        }}
        getAirplaneTypes={getAirplaneTypes}
      />
      <EditAirplaneTypeDialog
        open={openDialog.edit}
        onClose={() => {
          setOpenDialog({ ...openDialog, edit: false });
        }}
        getAirplaneTypes={getAirplaneTypes}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
      />
      <Card>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">Manage airplane types</Typography>
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
                  onClick={() => setOpenDialog({ ...openDialog, create: true })}
                  startIcon={<AddIcon />}
                >
                  Create
                </Button>
              </Stack>
            </Stack>
            <Box height={600}>
              <DataGrid
                sx={{ height: "100%", width: "100%" }}
                localeText={{ noRowsLabel: "No airplane types" }}
                rows={rows}
                columns={columns}
                getRowId={(params) => params._id}
                slots={{ toolbar: GridToolbar }}
                scrollbarSize={3}
                checkboxSelection
                density="compact"
                loading={isLoading}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[20, 50, 100]}
                getAirplaneTypesialState={{
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

export default AirplaneTypePage;
