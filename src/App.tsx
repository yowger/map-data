import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Map from "./map/Map"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
        },
    },
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Map />
        </QueryClientProvider>
    )
}
