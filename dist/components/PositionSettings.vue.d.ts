type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment' | 'weighted_avg_price' | 'expiry_date';
interface ColumnOption {
    field: ColumnField;
    label: string;
}
interface Props {
    appName: string;
    visibleCols: ColumnField[];
    allColumnOptions: ColumnOption[];
    columnRenames: Partial<Record<ColumnField, string>>;
}
declare function closeSettingsPopup(): void;
declare const _default: import('vue').DefineComponent<Props, {
    closeSettingsPopup: typeof closeSettingsPopup;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:appName": (name: string) => any;
    "update:visibleCols": (cols: ColumnField[]) => any;
    "update:columnRenames": (renames: Partial<Record<ColumnField, string>>) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:appName"?: ((name: string) => any) | undefined;
    "onUpdate:visibleCols"?: ((cols: ColumnField[]) => any) | undefined;
    "onUpdate:columnRenames"?: ((renames: Partial<Record<ColumnField, string>>) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    settingsBtnRef: HTMLButtonElement;
    settingsPopupRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
