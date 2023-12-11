export interface Account {
    password: string;
}

export interface User {
    userId: string;
    username: string;
    account: Account;
}
