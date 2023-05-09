import { userProfile } from "./userProfile"

export interface item{
    user: userProfile,
    price: number,
    description: string,
    image?: string
}

