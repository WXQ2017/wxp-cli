interface IBase {
    currentDir: string;
    localTempRepo: string;
    checkV(): void;
}
export default class Base implements IBase {
    localTempRepo: string;
    currentDir: string;
    checkV(): Promise<void>;
}
export {};
