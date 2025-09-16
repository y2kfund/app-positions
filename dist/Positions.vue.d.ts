import { Position } from '@y2kfund/core';
import { PositionsProps } from './index';
declare const _default: import('vue').DefineComponent<PositionsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "row-click": (row: Position) => any;
}, string, import('vue').PublicProps, Readonly<PositionsProps> & Readonly<{
    "onRow-click"?: ((row: Position) => any) | undefined;
}>, {
    accountId: string;
    highlightPnL: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    columnsBtnRef: HTMLButtonElement;
    columnsPopupRef: HTMLDivElement;
}, HTMLElement>;
export default _default;
