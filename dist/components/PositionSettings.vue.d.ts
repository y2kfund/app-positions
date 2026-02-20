type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment' | 'weighted_avg_price' | 'expiry_date' | 'dte' | 'delta' | 'unrealized_pnl_pct' | 'ul_entry_price' | 'ai_recommendation';
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
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<Props>>, {
    closeSettingsPopup: typeof closeSettingsPopup;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:appName": (name: string) => void;
    "update:visibleCols": (cols: ColumnField[]) => void;
    "update:columnRenames": (renames: Partial<Record<ColumnField, string>>) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<Props>>> & Readonly<{
    "onUpdate:appName"?: ((name: string) => any) | undefined;
    "onUpdate:visibleCols"?: ((cols: ColumnField[]) => any) | undefined;
    "onUpdate:columnRenames"?: ((renames: Partial<Record<ColumnField, string>>) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
