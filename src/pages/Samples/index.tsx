import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo } from 'react'
import { useHeader } from '@context/HeaderContext'
import SamplesSummaryBar from './components/SamplesSummary'
import SamplesToolbar from './components/SamplesToolbar'
import { useSamplesState } from './hooks/useSamplesState'
import { makeSamplesColumns } from './utils/columns'
import { handleExport, handleFileUpload } from './utils/csv'

export default function Samples() {
  const { setHeader } = useHeader()
  const {
    rows,
    visibleRows,
    summary,
    fileName,
    filter,
    setFilter,
    autoRecalc,
    setAutoRecalc,
    loadRows,
    updateRow,
    recalculateAll,
  } = useSamplesState()

  const { columns, processRowUpdate } = useMemo(
    () => makeSamplesColumns(updateRow, autoRecalc),
    [updateRow, autoRecalc],
  )

  useEffect(() => {
    const rowCount = `${summary.totalSamples} rows`
    const filterInfo = filter ? ` (filtered: ${summary.totalSamples})` : ''
    const fileInfo = fileName ? `file: ${fileName}` : rowCount + filterInfo
    setHeader('Samples', rows.length > 0 ? fileInfo : '')
  }, [setHeader, rows.length, summary.totalSamples, filter, fileName])

  return (
    <Box>
      <SamplesToolbar
        filter={filter}
        onFilterChange={setFilter}
        autoRecalc={autoRecalc}
        onAutoRecalcChange={setAutoRecalc}
        onRecalculate={recalculateAll}
        onFileUpload={(file) => handleFileUpload(file, loadRows)}
        onExport={() => handleExport(visibleRows)}
        hasData={rows.length > 0}
      />

      {rows.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 300,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant='h6'>No data loaded</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            Upload a CSV file to get started, or generate mock data below.
          </Typography>
        </Box>
      ) : (
        <>
          <SamplesSummaryBar summary={summary} />
          <DataGrid
            rows={visibleRows}
            columns={columns}
            editMode='row'
            processRowUpdate={processRowUpdate}
            pageSizeOptions={[25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            sx={{ height: 500 }}
          />
        </>
      )}
    </Box>
  )
}
