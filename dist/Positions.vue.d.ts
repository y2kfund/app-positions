import { Position } from '@y2kfund/core';
import { PositionsProps } from './index';
declare const _default: import('vue').DefineComponent<PositionsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "row-click": (row: Position) => any;
    minimize: () => any;
}, string, import('vue').PublicProps, Readonly<PositionsProps> & Readonly<{
    "onRow-click"?: ((row: Position) => any) | undefined;
    onMinimize?: (() => any) | undefined;
}>, {
    accountId: string;
    highlightPnL: boolean;
    showHeaderLink: boolean;
    userId: string | null;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    columnsBtnRef: HTMLButtonElement;
    columnsPopupRef: HTMLDivElement;
    tableDiv: HTMLDivElement;
}, any>;
export default _default;
