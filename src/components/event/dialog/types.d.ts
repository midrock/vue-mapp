export interface VMDialogParams {
    title: string;
    size: number;
    content: string;
    actions: VMDialogAction[];
}

export interface VMDialogAction {
    text: string;
    click: () => any;
}