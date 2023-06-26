import { HttpMethod } from "../enums/httpMethods";

export interface IFetchRequest {
    url: string,
    method?: HttpMethod;
    body?: BodyInit;
    pagination?: Ipagination;
}

export interface Ipagination {
    page: number;
    limit: number;
}