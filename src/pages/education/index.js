import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { apis } from "../../apis";
import { useSelector } from "react-redux";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const EducationPage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const { institute_id } = useParams();
  const [rows, setRows] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };
  const columns = [
    { field: "name", headerName: "Education name", width: 300 },
    { field: "code", headerName: "Code" },
    {
      field: "categories",
      headerName: "Categories",
      valueFormatter: (params) => {
        let temp = [];
        params.value.forEach((e) => {
          temp.push(e.name);
        });
        return temp.join(", ");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
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
                navigate(
                  `/institute/${institute_id}/education/${params.id}/edit`
                );
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                navigate(
                  `/institute/${institute_id}/education/${params.id}/view?tab=overview`
                )
              }
            >
              <RemoveRedEyeIcon />
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
      await apis.deleteEducations(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false, overview: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [institute_id]);

  const init = async () => {
    try {
      const {
        data: { educations },
      } = await apis.getEducations(`?institute_ids=${institute_id}`);
      setRows(educations);
    } catch (error) {}
  };

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete educations</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected educations?
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

      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box gap={1} display="flex">
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
                navigate(`/institute/${institute_id}/education/create`)
              }
              startIcon={<AddIcon />}
            >
              Create education
            </Button>
          </Box>
        </Stack>
        <Box height={600}>
          <DataGrid
            sx={{ height: "100%", width: "100%" }}
            localeText={{ noRowsLabel: "No educations" }}
            rows={rows}
            columns={columns}
            getRowId={(params) => params._id}
            scrollbarSize={3}
            checkboxSelection
            pageSizeOptions={[20, 50, 100]}
            loading={isLoading}
            density="compact"
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
    </Box>
  );
};

export default EducationPage;
