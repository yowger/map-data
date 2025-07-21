import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "../services/axios"

export type Barangay = {
    id: string
    name: string
}

export async function fetchBarangays(): Promise<Barangay[]> {
    const res = await axiosClient.get<Barangay[]>("/v1/barangays")
    
    return res.data
}

export function useGetBarangays() {
    return useQuery<Barangay[]>({
        queryKey: ["barangays"],
        queryFn: fetchBarangays,
        staleTime: Infinity,
        
    })
}
