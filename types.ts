import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";

// Used to infer types from Json Schema
// Allows you to use schema to validate route params _and_ provide typ safety
export type FastifyJsonSchema = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  JsonSchemaToTsProvider
>;
