export interface ReferenceSource {
    header: string;
    namespace?: string;
}

export interface Reference {
    title: string;
    path: string;
    source: ReferenceSource;
    children?: Reference[];
}
