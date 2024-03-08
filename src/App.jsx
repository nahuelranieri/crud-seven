import { MaterialReactTable, MRT_EditActionButtons, useMaterialReactTable } from 'material-react-table'
import mockData from './assets/MOCK_DATA.json'
import { useMemo } from 'react'
import './App.css'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';



function App() {
  const columns = useMemo(
    ()=>[
      {
        header: 'empresa',
        accessorKey: 'empresa',
        editVariant: 'select',
        editSelectOptions: [
          'Jason Industries, Inc.',
          'FORM Holdings Corp.',
        ]
      },
      {
        header: 'marca_meli',
        accessorKey: 'marca_meli'
      },
      {
        header: 'genero_meli',
        accessorKey: 'genero_meli',
        editVariant: 'select',
        editSelectOptions: [
          'Finance',
          'Miscellaneous',
          'Transportation',
          'Public Utilities'
        ]
      },
      {
        header: 'nombre_guia',
        accessorKey: 'nombre_guia'
      },
      {
        header: 'domain_id',
        accessorKey: 'domain_id',
        editVariant: 'select',
        editSelectOptions: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
        ]
      },
      {
        header: 'chart_id',
        accessorKey: 'chart_id',
        enableEditing: false,
      },
      {
        header: 'version',
        accessorKey: 'version'
      },
    ],[],
  )

  const handleCreateUser = ({values, table}) => {

  }

  const table = useMaterialReactTable({
    columns,
    data: mockData,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    onCreatingRowSave: handleCreateUser,
    enableEditing: true,
    renderCreateRowDialogContent: ({table, row, internalEditComponents}) => (
      <>
        <DialogTitle variant="h5">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({table}) => (
      <Button
        variant='contained'
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Crear
      </Button>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  })
  return (
    <MaterialReactTable
      table={table}
    />
  )
}

export default App
