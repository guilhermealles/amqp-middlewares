import { initializeContext } from "./context";
import { launch } from "./app";

initializeContext().then(async () => {
  await launch();
});
