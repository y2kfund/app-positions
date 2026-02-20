import { Position } from '@y2kfund/core';
import { PositionsProps } from './index';

declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<PositionsProps>, {
    accountId: string;
    highlightPnL: boolean;
    showHeaderLink: boolean;
    window: null;
    userId: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "row-click": (row: Position) => void;
    minimize: () => void;
    maximize: () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<PositionsProps>, {
    accountId: string;
    highlightPnL: boolean;
    showHeaderLink: boolean;
    window: null;
    userId: string;
}>>> & Readonly<{
    "onRow-click"?: ((row: Position) => any) | undefined;
    onMinimize?: (() => any) | undefined;
    onMaximize?: (() => any) | undefined;
}>, {
    accountId: string;
    highlightPnL: boolean;
    showHeaderLink: boolean;
    userId: string | null;
    window: string | null;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
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
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
