import {
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLObjectType,
} from 'graphql';

export function extractFields(obj: GraphQLObjectType): GraphQLField<any, any, any>[];
export function extractFields(obj: GraphQLInputObjectType): GraphQLInputField[];
export function extractFields(
    obj: GraphQLObjectType | GraphQLInputObjectType,
){
    const fieldMap = obj.getFields();
    if (!fieldMap) return [];
    return Object.keys(fieldMap).map((key) => fieldMap[key]);
}
