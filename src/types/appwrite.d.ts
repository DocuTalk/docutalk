declare module 'appwrite' {
    export class Client {
        setEndpoint(endpoint: string): this;
        setProject(projectId: string): this;
    }

    export class Account {
        constructor(client: Client);
        create(id: string, email: string, password: string, name: string): Promise<any>;
        createEmailSession(email: string, password: string): Promise<any>;
        get(): Promise<any>;
        deleteSession(sessionId: string): Promise<any>;
    }

    export class ID {
        static unique(): string;
    }
} 