export interface Municipality {
    id: number;
    name: string;
}
export interface Department {
    id: number;
    name: string;
    code: string;
    municipalities: Municipality[];
}
export declare const COLOMBIA_DATA: Department[];
