// drizzle/schema.ts
import {
    pgTable,
    serial,
    varchar,
    integer,
    boolean,
    decimal,
    time,
    date,
    text,
    primaryKey,
    pgEnum,
    timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 🧱 ENUMS
export const categoriaEnum = pgEnum("categoria", ["basico", "premium", "plus"]);
export const diaSemanaEnum = pgEnum("dia_semana", [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
]);
export const statusEnum = pgEnum("status_agendamento", [
    "pendente",
    "confirmado",
    "cancelado",
    "concluido",
]);

// 🏢 Barbearia
export const barbearias = pgTable("barbearias", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    fidelidadeAtiva: boolean("fidelidade_ativa").default(false).notNull(),
    fidelidadeQuantidade: integer("fidelidade_quantidade"),
    horaPausaEntreServicos: integer("hora_pausa_entre_servicos").default(0),
});

// 💇‍♂️ Barbeiro 
export const barbeiros = pgTable("barbeiros", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    whatsapp: varchar("whatsapp", { length: 20 }),
    instagram: varchar("instagram", { length: 255 }),
    horaAbertura: time("hora_abertura"),
    horaFechamento: time("hora_fechamento"),
    funcionamentoPersonalizado: boolean("funcionamento_personalizado").default(false),
    horaPausaEntreServicos: integer("hora_pausa_entre_servicos"),
    barbeariaId: integer("barbearia_id")
        .notNull()
        .references(() => barbearias.id, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 255 }),
    imageId: varchar("image_id", { length: 255 }),
});

// ✂️ Serviço
export const servicos = pgTable("servicos", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
    barbeariaId: integer("barbearia_id")
        .notNull()
        .references(() => barbearias.id, { onDelete: "cascade" }),
});

// 👤 Cliente
export const clientes = pgTable("clientes", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    telefone: varchar("telefone", { length: 20 }),
    fidelidadeContador: integer("fidelidade_contador").default(0),
    planoMensalId: integer("plano_mensal_id").references(() => planosMensais.id),
});

// 📅 Agendamento
export const agendamentos = pgTable("agendamentos", {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    clienteId: integer("cliente_id")
        .references(() => clientes.id, { onDelete: "cascade" }),
    barbeiroId: integer("barbeiro_id")
        .notNull()
        .references(() => barbeiros.id, { onDelete: "cascade" }),
    servicoId: integer("servico_id")
        .notNull()
        .references(() => servicos.id, { onDelete: "cascade" }),
    data: date("data").notNull(),
    hora: time("hora").notNull(),
    status: statusEnum("status").default("pendente").notNull(),
    planoMensalId: integer("plano_mensal_id").references(() => planosMensais.id),
    fidelidadeUsada: boolean("fidelidade_usada").default(false),
});

// 🧴 Produto
export const produtos = pgTable("produtos", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
    descricao: text("descricao"),
    imageUrl: varchar("image_url", { length: 255 }),
    imageId: varchar("image_id", { length: 255 }),
    barbeariaId: integer("barbearia_id")
        .notNull()
        .references(() => barbearias.id, { onDelete: "cascade" }),
});

// 🪒 Plano Mensal
export const planosMensais = pgTable("planos_mensais", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    brinde: varchar("brinde", { length: 255 }),
    preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
    categoria: categoriaEnum("categoria").notNull(),
    barbeariaId: integer("barbearia_id")
        .notNull()
        .references(() => barbearias.id, { onDelete: "cascade" }),
});

// 📋 Serviço Mensal (representa os serviços incluídos em um plano mensal)
export const servicosMensais = pgTable("servicos_mensais", {
    id: serial("id").primaryKey(),
    ilimitado: boolean("ilimitado").default(false).notNull(),
    servicoId: integer("servico_id")
        .notNull()
        .references(() => servicos.id, { onDelete: "cascade" }),
    planoMensalId: integer("plano_mensal_id")
        .notNull()
        .references(() => planosMensais.id, { onDelete: "cascade" }),
    quantidadePermitida: integer("quantidade_permitida"), // Quantas vezes pode agendar no mês
});

// 🕓 Funcionamento
export const funcionamentos = pgTable("funcionamentos", {
    id: serial("id").primaryKey(),
    diaSemana: diaSemanaEnum("dia_semana").notNull(),
    horaAbertura: time("hora_abertura").notNull(),
    horaFechamento: time("hora_fechamento").notNull(),
    funcionando: boolean("funcionando").default(true),
    barbeariaId: integer("barbearia_id")
        .notNull()
        .references(() => barbearias.id, { onDelete: "cascade" }),
});

export const assinaturas = pgTable("assinaturas", {
    id: serial("id").primaryKey(),
    clienteId: integer("cliente_id")
        .notNull()
        .references(() => clientes.id, { onDelete: "cascade" }),
    planoMensalId: integer("plano_mensal_id")
        .notNull()
        .references(() => planosMensais.id, { onDelete: "cascade" }),
    dataAssinatura: date("data_assinatura").notNull(),
    dataExpiracao: date("data_expiracao").notNull(),
})


// 📎 RELACIONAMENTOS (Drizzle Relations)
export const barbeariaRelations = relations(barbearias, ({ many }) => ({
    barbeiros: many(barbeiros),
    servicos: many(servicos),
    produtos: many(produtos),
    planosMensais: many(planosMensais),
    funcionamentos: many(funcionamentos),
}));

export const barbeiroRelations = relations(barbeiros, ({ one, many }) => ({
    barbearia: one(barbearias, {
        fields: [barbeiros.barbeariaId],
        references: [barbearias.id],
    }),
    agendamentos: many(agendamentos),
}));

export const servicoRelations = relations(servicos, ({ one, many }) => ({
    barbearia: one(barbearias, {
        fields: [servicos.barbeariaId],
        references: [barbearias.id],
    }),
    agendamentos: many(agendamentos),
    servicosMensais: many(servicosMensais),
}));

export const agendamentoRelations = relations(agendamentos, ({ one, many }) => ({
    cliente: one(clientes, {
        fields: [agendamentos.clienteId],
        references: [clientes.id],
    }),
    barbeiro: one(barbeiros, {
        fields: [agendamentos.barbeiroId],
        references: [barbeiros.id],
    }),
    servico: one(servicos, {
        fields: [agendamentos.servicoId],
        references: [servicos.id],
    }),
    planoMensal: one(planosMensais, {
        fields: [agendamentos.planoMensalId],
        references: [planosMensais.id],
    }),
    assinatura: many(assinaturas),
    user: one(user, {
        fields: [agendamentos.userId],
        references: [user.id],
    }),
}));

export const clienteRelations = relations(clientes, ({ one, many }) => ({
    planoMensal: one(planosMensais, {
        fields: [clientes.planoMensalId],
        references: [planosMensais.id],
    }),
    agendamentos: many(agendamentos),
}));

export const planoMensalRelations = relations(planosMensais, ({ one, many }) => ({
    barbearia: one(barbearias, {
        fields: [planosMensais.barbeariaId],
        references: [barbearias.id],
    }),
    servicosMensais: many(servicosMensais),
    clientes: many(clientes),
}));

export const servicoMensalRelations = relations(
    servicosMensais,
    ({ one }) => ({
        planoMensal: one(planosMensais, {
            fields: [servicosMensais.planoMensalId],
            references: [planosMensais.id],
        }),
        servico: one(servicos, {
            fields: [servicosMensais.servicoId],
            references: [servicos.id],
        }),
    })
);

export const funcionamentoRelations = relations(funcionamentos, ({ one }) => ({
    barbearia: one(barbearias, {
        fields: [funcionamentos.barbeariaId],
        references: [barbearias.id],
    }),
}));



export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

