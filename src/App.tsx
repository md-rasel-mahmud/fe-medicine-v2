import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />

        <Toaster position="top-center" richColors />
      </Provider>
    </>
  );
}

export default App;
