import { userProfile } from "./userProfile"

export interface item{
    name?: string,
    user: userProfile,
    price: number,
    description: string,
    image?: string,
    pickup?: string
}

