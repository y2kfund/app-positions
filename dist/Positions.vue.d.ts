import { Position } from '@y2kfund/core';
import { PositionsProps } from './index';
declare const _default: import('vue').DefineComponent<PositionsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "row-click": (row: Position) => any;
    minimize: () => any;
    maximize: () => any;
}, string, import('vue').PublicProps, Readonly<PositionsProps> & Readonly<{
    "onRow-click"?: ((row: Position) => any) | undefined;
    onMinimize?: (() => any) | undefined;
    onMaximize?: (() => any) | undefined;
}>, {
    userId: string | null;
    accountId: string;
    highlightPnL: boolean;
    showHeaderLink: boolean;
    window: string | null;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    tableDiv: HTMLDivElement;
}, any>;
export default _default;
