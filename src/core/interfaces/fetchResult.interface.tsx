export interface FetchResult<T> {
    response: IResponse;
    loading: boolean;
    error: Error | null;
}

export interface IResponse {
    results: any[],
    info: any;
} 