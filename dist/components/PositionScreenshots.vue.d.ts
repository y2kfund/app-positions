import { SupabaseClient } from '@supabase/supabase-js';
interface ScreenshotMetadata {
    filters?: {
        account?: string | null;
        assetClass?: string | null;
        symbolTags?: string[];
        thesisTags?: string[];
        columns?: string[];
    };
}
interface Screenshot {
    id: number;
    user_id: string;
    created_at: string;
    image_data: string;
    name: string | null;
    archived: boolean;
    meta?: ScreenshotMetadata;
}
interface Props {
    userId: string;
    supabase: SupabaseClient;
    captureElement: HTMLElement | null;
    metadata?: ScreenshotMetadata;
}
declare function promptScreenshotName(): void;
declare function fetchScreenshots(): Promise<void>;
declare const _default: import('vue').DefineComponent<Props, {
    promptScreenshotName: typeof promptScreenshotName;
    fetchScreenshots: typeof fetchScreenshots;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "screenshot-taken": (screenshot: Screenshot) => any;
    "screenshot-archived": (id: number) => any;
    "screenshot-renamed": (id: number, name: string) => any;
    toast: (type: "success" | "error" | "warning" | "info", title: string, message?: string | undefined) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    "onScreenshot-taken"?: ((screenshot: Screenshot) => any) | undefined;
    "onScreenshot-archived"?: ((id: number) => any) | undefined;
    "onScreenshot-renamed"?: ((id: number, name: string) => any) | undefined;
    onToast?: ((type: "success" | "error" | "warning" | "info", title: string, message?: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
