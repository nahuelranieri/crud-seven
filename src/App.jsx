import { MaterialReactTable, MRT_EditActionButtons, useMaterialReactTable } from 'material-react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  createSizeTemplate,
  deleteSizeTemplate,
  getOptions,
  getSizeTemplates,
  updateSizeTemplate,
} from './api'

const toPayload = (values) => ({
  client_id: Number(values.client_id),
  brand: values.brand,
  gender: values.gender,
  domain_id: values.domain_id,
  chart_id: values.chart_id === '' || values.chart_id == null ? null : Number(values.chart_id),
})

function App() {
  const [data, setData] = useState([])
  const [genderOptions, setGenderOptions] = useState([])
  const [domainOptions, setDomainOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setData(await getSizeTemplates())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    Promise.all([getOptions('gender'), getOptions('domain')])
      .then(([genders, domains]) => {
        setGenderOptions(genders)
        setDomainOptions(domains)
      })
      .catch((e) => setError(e.message))
  }, [loadData])

  const save = async (request, exit) => {
    setIsSaving(true)
    try {
      await request()
      await loadData()
      exit()
    } catch (e) {
      setError(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  const columns = useMemo(
    ()=>[
      {
        header: 'id',
        accessorKey: 'id',
        enableEditing: false,
        size: 80,
      },
      {
        header: 'client_id',
        accessorKey: 'client_id',
        muiEditTextFieldProps: { type: 'number', required: true },
      },
      {
        header: 'cliente',
        accessorKey: 'client_fantasy_name',
        enableEditing: false,
      },
      {
        header: 'brand',
        accessorKey: 'brand',
        muiEditTextFieldProps: { required: true },
      },
      {
        header: 'gender',
        accessorKey: 'gender',
        editVariant: 'select',
        editSelectOptions: genderOptions,
      },
      {
        header: 'domain_id',
        accessorKey: 'domain_id',
        editVariant: 'select',
        editSelectOptions: domainOptions,
      },
      {
        header: 'chart_id',
        accessorKey: 'chart_id',
        muiEditTextFieldProps: { type: 'number' },
      },
    ],[genderOptions, domainOptions],
  )

  const handleCreate = ({ values, table }) =>
    save(() => createSizeTemplate(toPayload(values)), () => table.setCreatingRow(null))

  const handleEdit = ({ row, values, table }) =>
    save(() => updateSizeTemplate(row.original.id, toPayload(values)), () => table.setEditingRow(null))

  const handleDelete = (row) => {
    if (window.confirm(`¿Eliminar la guía ${row.original.id} (${row.original.brand})?`)) {
      save(() => deleteSizeTemplate(row.original.id), () => {})
    }
  }

  const table = useMaterialReactTable({
    columns,
    data,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleEdit,
    enableEditing: true,
    state: { isLoading, isSaving, showAlertBanner: !!error },
    muiToolbarAlertBannerProps: error ? { color: 'error', children: error } : undefined,
    renderCreateRowDialogContent: ({table, row, internalEditComponents}) => (
      <>
        <DialogTitle variant="h5">Crear guía de talles</DialogTitle>
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
          <IconButton color="error" onClick={() => handleDelete(row)}>
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
