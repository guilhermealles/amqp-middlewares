import { initializeContext } from "./context";
import { launch } from "./app";

initializeContext().then(() => {
  launch();
});
