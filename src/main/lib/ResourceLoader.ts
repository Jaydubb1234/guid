export class ResourceLoader {
    private static readonly BASE_PATH: string = "./resources/";

    public constructor(private fs: any) { }

    public loadJsonResource(resourcePath: string): string {
        const fullPath: string = ResourceLoader.BASE_PATH + resourcePath;

        const result: string = JSON.parse(this.fs.readFileSync(fullPath, "utf8"));

        return result;
    }
}
