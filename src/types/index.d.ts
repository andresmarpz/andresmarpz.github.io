export type Page = (path: string) => string | Promise<string>

export interface Route {
    path: string;
    page: Page;
}
