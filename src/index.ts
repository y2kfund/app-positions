import Positions from './Positions.vue'

export { Positions }
export default Positions

// Props interface
export interface PositionsProps {
  accountId: string
  highlightPnL?: boolean
  onRowClick?: (row: any) => void
  showHeaderLink?: boolean  // Whether to show the header as a router-link (for use in dashboard with routing)
}