import { item } from "./item";

export interface userProfile{
    name: string,
    cart: item[],
    uid: string,
    number?: string,
    email?: string
}