// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { PageContextServer } from "vike/types";
import { getTodoItems } from "../../database/todoItems";

async function onBeforeRender(pageContext: PageContextServer) {
  const todoItemsInitial = await getTodoItems();

  return {
    pageContext: {
      pageProps: {
        todoItemsInitial,
        xRuntime: pageContext.xRuntime,
      },
    },
  };
}
