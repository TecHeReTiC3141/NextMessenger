import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {

    interface Session {
        user: User;
        accessToken: string;
    }

    interface User extends DefaultUser{
        id: string;
        description: string | null,
        access_token?: string;
    }

}