import { GridEditInputCell, type GridColDef, type GridPreProcessEditCellProps } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'
import { z } from 'zod'
import type { SampleRow } from '../../types'
import { recalcRow } from '../../utils'

const nonNegativeNumber = z.number().nonnegative('Must be ≥ 0')

function makeNumberPreProcess(
  schema: z.ZodNumber,
): (params: GridPreProcessEditCellProps) => GridPreProcessEditCellProps {
  return (params) => {
    const raw = params.props.value
    const value = typeof raw === 'string' ? parseFloat(raw) : raw
    const result = schema.safeParse(value)
    const error = result.success ? undefined : result.error.issues[0]?.message
    return { ...params, props: { ...params.props, error } }
  }
}

function EditCellWithTooltip(
  props: Parameters<NonNullable<GridColDef['renderEditCell']>>[0],
) {
  return (
    <Tooltip
      open={!props.hasFocus && !!props.error}
      title={typeof props.error === 'string' ? props.error : ''}
      placement='top'
      arrow
    >
      <span style={{ width: '100%', display: 'flex' }}>
        <GridEditInputCell {...props} />
      </span>
    </Tooltip>
  )
}

export function makeSamplesColumns(
  updateRow: (updatedRow: SampleRow) => void,
  autoRecalc: boolean,
): { columns: GridColDef<SampleRow>[]; processRowUpdate: (newRow: SampleRow) => SampleRow } {
  function processRowUpdate(newRow: SampleRow): SampleRow {
    const updated = autoRecalc ? recalcRow(newRow) : newRow
    updateRow(updated)
    return updated
  }

  const columns: GridColDef<SampleRow>[] = [
    {
      field: 'sampleId',
      headerName: 'Sample ID',
      flex: 1,
      editable: true,
      preProcessEditCellProps: (params) => {
        const result = z.string().min(1, 'Required').safeParse(params.props.value)
        const error = result.success ? undefined : result.error.issues[0]?.message
        return { ...params, props: { ...params.props, error } }
      },
      renderEditCell: (params) => <EditCellWithTooltip {...params} />,
    },
    {
      field: 'moisture',
      headerName: 'Moisture (%)',
      type: 'number',
      flex: 1,
      editable: true,
      preProcessEditCellProps: makeNumberPreProcess(nonNegativeNumber),
      renderEditCell: (params) => <EditCellWithTooltip {...params} />,
    },
    {
      field: 'dryDensity',
      headerName: 'Dry Density (g/cm³)',
      type: 'number',
      flex: 1,
      editable: true,
      preProcessEditCellProps: makeNumberPreProcess(nonNegativeNumber),
      renderEditCell: (params) => <EditCellWithTooltip {...params} />,
    },
    {
      field: 'correctionFactor',
      headerName: 'Correction Factor (%)',
      type: 'number',
      flex: 1,
      editable: true,
      preProcessEditCellProps: makeNumberPreProcess(nonNegativeNumber),
      renderEditCell: (params) => <EditCellWithTooltip {...params} />,
    },
    {
      field: 'porosity',
      headerName: 'Porosity (%)',
      type: 'number',
      flex: 1,
      editable: true,
      preProcessEditCellProps: makeNumberPreProcess(nonNegativeNumber),
      renderEditCell: (params) => <EditCellWithTooltip {...params} />,
    },
    {
      field: 'adjustedMoisture',
      headerName: 'Adjusted Moisture (%)',
      type: 'number',
      flex: 1,
      valueFormatter: (value: number) => value.toFixed(4),
    },
    {
      field: 'adjustedDensity',
      headerName: 'Adjusted Density (g/cm³)',
      type: 'number',
      flex: 1,
      valueFormatter: (value: number) => value.toFixed(4),
    },
  ]

  return { columns, processRowUpdate }
}
