// Virtual Wine Cellar 登録ユーザ/管理者
enum ROLES {
    USER, ADMIN
}

export interface User {
    id: string;
    loginname: string;
    password?: string;
    firstname: string;
    lastname: string;
    role: string;
}