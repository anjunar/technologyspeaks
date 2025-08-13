export function useServer() : boolean {
    return typeof window === "undefined"
}