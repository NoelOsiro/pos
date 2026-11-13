import { zodResolver as resolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { z as z3 } from "zod";
import type { z as z4 } from "zod/v4";

// The resolver package is typed against a different Zod peer than this app uses.
type Zod3Resolver = <Schema extends z3.ZodTypeAny>(
  schema: Schema
) => Resolver<z3.infer<Schema> extends FieldValues ? z3.infer<Schema> : never>;
type Zod4Resolver = <Schema extends z4.ZodType>(
  schema: Schema
) => Resolver<z4.infer<Schema> extends FieldValues ? z4.infer<Schema> : never>;

export const zodResolver = resolver as unknown as Zod3Resolver & Zod4Resolver;
