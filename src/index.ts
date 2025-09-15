import Positions from './Positions.vue'

export { Positions }
export default Positions

// Props interface
export interface PositionsProps {
  accountId: string
  highlightPnL?: boolean
  onRowClick?: (row: any) => void
}