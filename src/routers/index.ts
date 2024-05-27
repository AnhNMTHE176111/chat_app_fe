import { createBrowserRouter, createHashRouter } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes, {
  unstable_dataStrategy({ request, matches }) {
    return Promise.all(
      matches.map(async (match) => {
        console.log(`Processing route ${match.route.id}`);
        // Don't override anything - just resolve route.lazy + call loader
        let result = await match.resolve();
        console.log(`Done processing route ${match.route.id}`);
        return result;
      })
    );
  },
});

export default router;
