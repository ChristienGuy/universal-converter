import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";

// Used to infer types from Json Schema
// Allows you to use schema to validate route params _and_ provide typ safety
export type FastifyTypeboxSchema = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;
