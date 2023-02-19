import type { GraphQLField, GraphQLObjectType } from "graphql";

export function extractFields(obj: GraphQLObjectType): GraphQLField<any, any, any>[] {
    const fieldMap = obj.getFields();
    if (!fieldMap) return [];
    return Object.keys(fieldMap).map((key) => fieldMap[key]);
}

