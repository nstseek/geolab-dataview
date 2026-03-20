import DownloadIcon from '@mui/icons-material/Download'
import RecyclingIcon from '@mui/icons-material/Recycling'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useRef } from 'react'

interface SamplesToolbarProps {
  filter: string
  onFilterChange: (value: string) => void
  autoRecalc: boolean
  onAutoRecalcChange: (value: boolean) => void
  onRecalculate: () => void
  onFileUpload: (file: File) => void
  onExport: () => void
  hasData: boolean
}

export default function SamplesToolbar({
  filter,
  onFilterChange,
  autoRecalc,
  onAutoRecalcChange,
  onRecalculate,
  onFileUpload,
  onExport,
  hasData,
}: SamplesToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
      e.target.value = ''
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant='outlined'
        startIcon={<UploadFileIcon />}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload CSV
      </Button>

      <Button
        variant='outlined'
        startIcon={<DownloadIcon />}
        component='a'
        href='/sample.csv'
        download='sample.csv'
      >
        Download Sample CSV
      </Button>

      <TextField
        size='small'
        label='Filter by Sample ID'
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        sx={{ minWidth: 220, width: { xs: '100%', sm: 'auto' } }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={autoRecalc}
            onChange={(e) => onAutoRecalcChange(e.target.checked)}
            color='secondary'
          />
        }
        label='Auto Recalculate'
      />

      {!autoRecalc && (
        <Button
          variant='contained'
          startIcon={<RecyclingIcon />}
          onClick={onRecalculate}
          color='secondary'
        >
          Recalculate
        </Button>
      )}

      {hasData && (
        <Button
          variant='outlined'
          startIcon={<DownloadIcon />}
          onClick={onExport}
          sx={{ ml: 'auto' }}
        >
          Export CSV
        </Button>
      )}
    </Box>
  )
}
