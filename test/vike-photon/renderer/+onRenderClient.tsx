// https://vike.dev/onRenderClient
export { onRenderClient };

import ReactDOM from "react-dom/client";
import type { PageContextClient } from "vike/types";
import { PageLayout } from "./PageLayout";

let root: ReactDOM.Root;
async function onRenderClient(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  const page = (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );
  // biome-ignore lint/style/noNonNullAssertion: we know it exists
  const container = document.getElementById("page-view")!;
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }
}
