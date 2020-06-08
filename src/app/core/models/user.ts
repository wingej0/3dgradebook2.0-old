export interface User {
    uid : string,
    email : string,
    photoURL : string,
    displayName : string,
    school? : string,
    city? : string,
    state? : string,
    import? : {
        source? : string,
        domain? : string,
        token? : string,
    },
}
