///<reference types="@photonjs/core" />
///<reference types="@photonjs/vercel/types"/>
type ValueOf<T> = T extends {
  [k: string]: infer U;
}
  ? U
  : never;

declare module "@photonjs/core" {
  namespace Photon {
    interface EntryBase {
      vikeMeta?: {
        pageId: string;
        page: ValueOf<import("vike/types").VikeConfig["pages"]>;
      };
    }
  }
}

export {};
