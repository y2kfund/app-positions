import { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/vue-query';

export interface Thesis {
    id: string;
    title: string;
    parent_thesis_id?: string | null;
    [key: string]: any;
}
export interface Position {
    id?: number;
    internal_account_id: string;
    legal_entity?: string | {
        name?: string;
        id?: string;
    };
    symbol: string;
    asset_class: string;
    conid: string;
    thesis?: {
        id: string;
        title: string;
    } | null;
    [key: string]: any;
}
export interface ThesisGroup {
    id: string;
    _isThesisGroup: true;
    _isParentThesis: boolean;
    thesis: Thesis;
    symbol: string;
    legal_entity: string;
    _children: any[];
    [key: string]: any;
}
export interface UseThesisConnectionOptions {
    supabase: SupabaseClient;
    queryClient: QueryClient;
    numericFields: readonly string[];
    showToast?: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}
export interface ThesisGroupingOptions {
    sourcePositions: Position[];
    thesisData: Thesis[];
    groupByThesis: boolean;
    accountFilter: string | null;
    symbolTagFilters: string[];
    thesisTagFilters: string[];
    extractTagsFromSymbol: (symbol: string) => string[];
}
export declare function useThesisConnection(options: UseThesisConnectionOptions): {
    updateThesisConnection: (symbolRoot: string, thesisId: string | null) => Promise<void>;
    createGroupedHierarchicalData: (groupingOptions: ThesisGroupingOptions) => (Position | ThesisGroup)[];
    isThesisGroup: (row: any) => row is ThesisGroup;
    isParentThesisGroup: (row: any) => boolean;
};
