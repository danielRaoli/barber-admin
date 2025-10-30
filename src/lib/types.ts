import { barbeiros, planosMensais, produtos, servicos } from "@/db/schema";

// Tipo inferido do schema do banco de dados
export type Barber = typeof barbeiros.$inferSelect;
export type Service = typeof servicos.$inferSelect;
export type Product = typeof produtos.$inferSelect;
export type Plan = typeof planosMensais.$inferSelect;
