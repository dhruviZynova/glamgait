import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive background fetches
      retry: 1, // Retries once on failure
    },
  },
});

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </HelmetProvider>
);