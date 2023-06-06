import {User} from "com.malte.angular-client-sdk/lib/models/User";

export interface MailAlias {
id: number;
mailbox?: string;
createdAt: Date
user: User;
}
