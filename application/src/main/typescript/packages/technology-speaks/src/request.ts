export interface RequestInformation {
    protocol : string
    host : string
    path : string
    search : string
    cookie : Record<string, string>
    language :string
}