// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TZDate = any;

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tizen: any;
    }
  }
}
