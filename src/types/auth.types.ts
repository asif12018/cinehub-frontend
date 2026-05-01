export interface ILoginResponse {
    token : string;
    accessToken : string;
    refreshToken : string;
    user : {
        id: string;
        email : string;
        name : string;
        role : string;
        image: string;
        banned: boolean;
        banReason: null | string;
        banExpires: null | Date;
        createdAt: Date;
        updatedAt: Date;
        gender: string;
        accounts: Object;
        subscriptions: Object;
        watchlist_items: Object;
        status : string;
        isDeleted : boolean;
        emailVerified : boolean;
    }
}
