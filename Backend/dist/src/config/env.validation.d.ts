declare class EnvironmentVariables {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
}
export declare function validate(config: Record<string, any>): EnvironmentVariables;
export {};
