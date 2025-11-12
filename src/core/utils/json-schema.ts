import { zodToJsonSchema } from "zod-to-json-schema";

export const jsonSchemaTransform = ({ schema, url }: { schema: any; url: string }) => {
  const { ...rest } = schema;
  const transformed = {
    ...rest,
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...(schema.body ? { body: zodToJsonSchema(schema.body, 'body') } : {}),
    ...(schema.querystring ? { querystring: zodToJsonSchema(schema.querystring, 'querystring') } : {}),
    ...(schema.params ? { params: zodToJsonSchema(schema.params, 'params') } : {}),
    ...(schema.headers ? { headers: zodToJsonSchema(schema.headers, 'headers') } : {}),
    ...(schema.response
      ? {
          response: {
            ...Object.entries(schema.response).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: zodToJsonSchema(value as any, `response_${key}`),
              }),
              {}
            ),
          },
        }
      : {}),
  };
  return transformed;
};
