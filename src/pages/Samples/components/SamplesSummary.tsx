import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { SamplesSummary } from '../hooks/useSamplesState'

interface SamplesSummaryProps {
  summary: SamplesSummary
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card variant='outlined' sx={{ minWidth: 160 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function SamplesSummaryBar({ summary }: SamplesSummaryProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <SummaryCard label='Total Samples' value={String(summary.totalSamples)} />
      <SummaryCard label='Avg Adjusted Moisture' value={`${summary.avgMoisture.toFixed(4)} %`} />
      <SummaryCard label='Avg Adjusted Density' value={`${summary.avgDensity.toFixed(4)} g/cm³`} />
    </Box>
  )
}
