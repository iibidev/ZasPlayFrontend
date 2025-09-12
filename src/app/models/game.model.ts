export interface Game{
    _id: string,
    name: string,
    description: string,
    icon: string,
    thumbnail: string,
    background: string,
    route: string,
    totalPlayed: string,
    min: number,
    max: number,
    isInDevelopment: boolean
}