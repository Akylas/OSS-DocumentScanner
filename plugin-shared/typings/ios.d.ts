declare class IOSSharedUtils extends NSObject {
    static generateCodeChallenge(str: string): string;
    static checkAvailableStorage(sizeBytes: number): boolean;
}
