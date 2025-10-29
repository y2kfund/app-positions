import { default as Positions } from './Positions.vue';
export { Positions };
export default Positions;
export interface PositionsProps {
    accountId: string;
    highlightPnL?: boolean;
    onRowClick?: (row: any) => void;
    showHeaderLink?: boolean;
    userId?: string | null;
    window?: string | null;
}
