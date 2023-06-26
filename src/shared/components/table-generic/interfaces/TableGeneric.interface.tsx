export interface ITableGeneric {
    title: string;
    columns: IColumn[];
    data: any[];
    filter: IColumn;
    page?: number;
    limit?: number;
    path?: string;
}

export interface IColumn {
    type: 'text' | 'img' | 'action';
    key: string;
    label: string;
    orderBy?: 'ASC' | 'DESC';
}