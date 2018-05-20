
export interface VMFindByClassParams {
    element: any;
    searchClass: string | string[];
    exitClass?: string | string[];
    exitElement?: any;
    recursive?: boolean;
    log?: boolean;
}