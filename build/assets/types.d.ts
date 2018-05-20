
export type LogType =
    | 'success'
    | 'info'
    | 'error'
    | 'process'
    | 'start'
    | 'tab'
    ;

export interface LogCounters {
    error: number;
    success: number;
}

export interface TemplateCompileResult {
    render: string;
    staticRender: string;
}

export interface ReqReadParams {
    dir: string;
    onfile?: (file: string) => Promise<any>;
    ondir?: (dir: string) => Promise<any>;
}

export interface WatchOptions {
    path: string;
    recursive?: boolean;
    callback: (e: any, path: string) => void;
}