
export interface VMFindByClassParams {
    element: any;
    searchClass: string | string[];
    exitClass?: string | string[];
    exitElement?: any;
    recursive?: boolean;
    log?: boolean;
}


export interface VMCalcAxisPosition {
    triggerDistance: number;
    triggerSize: number;
    windowLength: number;
    contentSize: number;
    offset: number;
    backPositionName: string;
    frontPositionName: string;
    distanceProp: string;
    contentSizeProp: string;
    space: number;
    position: string;
    floatTrigger: boolean;
}
