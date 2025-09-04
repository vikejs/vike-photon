///<reference types="@photonjs/core" />
type ValueOf<T> = T extends {
  [k: string]: infer U
}
  ? U
  : never

declare module '@photonjs/core' {
  namespace Photon {
    interface EntryBase {
      vikeMeta?: {
        pageId: string
        page: ValueOf<VikeConfig['pages']>
      }
    }
  }
}

export {}
