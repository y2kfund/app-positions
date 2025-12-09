/**
 * useUrlState - Composable for URL state management
 *
 * Handles reading and writing various state to URL parameters for:
 * - Column renames
 * - Visible columns
 * - Column widths
 * - Sort order
 * - Filters (symbol, thesis, asset class, account)
 * - Group by thesis toggle
 * - App name
 */
export type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment' | 'weighted_avg_price' | 'expiry_date';
export type ColumnRenames = Partial<Record<ColumnField, string>>;
export interface UrlFilters {
    symbol?: string;
    asset_class?: string;
    legal_entity?: string;
    thesis?: string;
}
export interface SortState {
    field: string;
    dir: 'asc' | 'desc';
}
export interface ColumnOption {
    field: ColumnField;
    label: string;
}
export interface UseUrlStateOptions {
    windowId: string | null;
    allColumnOptions: ColumnOption[];
    hiddenByDefault?: ColumnField[];
}
export declare function useUrlState(options: UseUrlStateOptions): {
    parseColumnRenamesFromUrl: () => ColumnRenames;
    writeColumnRenamesToUrl: (renames: ColumnRenames) => void;
    parseVisibleColsFromUrl: () => ColumnField[];
    writeVisibleColsToUrl: (cols: ColumnField[]) => void;
    parseColumnWidthsFromUrl: () => Record<string, number>;
    writeColumnWidthsToUrl: (widths: Record<string, number>) => void;
    parseSortFromUrl: () => SortState | null;
    writeSortToUrl: (field: string, dir: "asc" | "desc") => void;
    clearSortFromUrl: () => void;
    parseFiltersFromUrl: () => UrlFilters;
    writeFiltersToUrl: (filters: {
        symbolTagFilters: string[];
        thesisTagFilters: string[];
        assetClassFilter: string | null;
    }) => void;
    writeAccountFilterToUrl: (accountId: string | null) => void;
    clearFiltersFromUrl: () => void;
    parseGroupByThesisFromUrl: () => boolean;
    writeGroupByThesisToUrl: (isGrouped: boolean) => void;
    parseAppNameFromUrl: (defaultName?: string) => string;
    writeAppNameToUrl: (name: string, defaultName?: string) => void;
};
