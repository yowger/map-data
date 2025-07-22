import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Container from "./Container"
import FilterProvider from "./components/providers/filterProvider"
import { MapProvider } from "./components/providers/mapProvider"

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
        <FilterProvider>
            <MapProvider>
                <QueryClientProvider client={queryClient}>
                    <Container />
                </QueryClientProvider>
            </MapProvider>
        </FilterProvider>
    )
}
