#!/usr/bin/env node
import Base from "./domain/Base";
interface IWxqInit {
    run(): void;
    downloadAndGenerate(tmpRepo: string, tmpName: string, tmpUrl: string): void;
}
export default class WxqInit extends Base implements IWxqInit {
    run(): Promise<void>;
    downloadAndGenerate(tmpRepo: string, tmpName: string, tmpUrl: string): void;
}
export {};
