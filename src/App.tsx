import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Container from "./Container"
import FilterProvider from "./components/filterProvider"

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
            <QueryClientProvider client={queryClient}>
                <Container />
            </QueryClientProvider>
        </FilterProvider>
    )
}
