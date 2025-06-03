export type ReferenceAcessor = 'public' | 'protected' | 'private';
export type ReferenceModifier = 'static' | 'inline' | 'constexpr' | 'const';
export type ReferenceFunctionType = 'standard' | 'virtual' | 'override';

export interface ReferenceType {
    prefix: string;
    name: string;
    suffix: string;
    path: string;
    templates: ReferenceType[];
}

export interface ReferenceTypeDef {
    name: string;
    type: ReferenceType;
    description: string;
}

export interface ReferenceEnum {
    type: ReferenceType;
    name: string;
    description: string;
}

export interface ReferenceFunctionParameter {
    type: ReferenceType;
    name: string;
}

export interface ReferenceFunction {
    accessor: ReferenceAcessor;
    type: ReferenceFunctionType;
    return: ReferenceType;
    name: string;
    parameters: ReferenceFunctionParameter[];
    modifiers: ReferenceModifier[];
    description: string;
}

export interface ReferenceMember {
    accessor: ReferenceAcessor;
    modifiers: ReferenceModifier[];
    type: ReferenceType;
    name: string;
    initializer: string;
    description: string;
}

export interface ReferenceSource {
    header: string;
    namespace?: string;
    types: ReferenceTypeDef[];
    enums: ReferenceEnum[];
    constructors: ReferenceFunction[];
    destructors: ReferenceFunction[];
    functions: ReferenceFunction[];
    members: ReferenceMember[];
    description: string;
}

export interface Reference {
    title: string;
    path: string;
    source: ReferenceSource;
    children: Reference[];
}

export interface ReferenceIndex {
    title: string;
    path: string;
    source: Pick<ReferenceSource, 'header' | 'namespace'>;
    children: ReferenceIndex[];
}
