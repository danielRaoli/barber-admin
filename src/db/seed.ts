import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { auth } from "../lib/auth";
import { barbearias, funcionamentos } from "./schema";

async function ensureAdminUser() {
  try {
    await auth.api.signUpEmail({
      body: {
        name: "Admin",
        email: "admin@barber.com",
        password: "admin123",
      },
    });
    console.log("✅ Usuário admin criado: admin@barber.com");
  } catch (error: any) {
    const code = error?.error?.code || error?.code;
    if (code === "USER_ALREADY_EXISTS") {
      console.log("ℹ️ Usuário admin já existe, prosseguindo...");
    } else {
      console.error("❌ Erro ao criar usuário admin:", error?.error?.message || error);
      throw error;
    }
  }
}

async function ensureBarbearia() {
  const existing = await db
    .select()
    .from(barbearias)
    .where(eq(barbearias.id, 1));

  if (existing.length > 0) {
    console.log("ℹ️ Barbearia (ID=1) já existe, prosseguindo...");
    return;
  }

  await db.insert(barbearias).values({
    id: 1,
    nome: "BarberApp",
    fidelidadeAtiva: false,
    horaPausaEntreServicos: 30,
  });
  console.log("✅ Barbearia criada: BarberApp (ID=1)");
}

async function ensureFuncionamentos() {
  const dias = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ] as const;

  for (const dia of dias) {
    const exists = await db
      .select()
      .from(funcionamentos)
      .where(eq(funcionamentos.diaSemana, dia as any));

    if (exists.length > 0) {
      continue;
    }

    await db.insert(funcionamentos).values({
      diaSemana: dia as any,
      horaAbertura: "08:00",
      horaFechamento: "18:00",
      funcionando: true,
      barbeariaId: 1,
    });
  }
  console.log("✅ Funcionamentos criados para todos os dias da semana");
}

async function main() {
  await ensureAdminUser();
  await ensureBarbearia();
  await ensureFuncionamentos();
}

main()
  .then(() => {
    console.log("🎉 Seed concluído com sucesso.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed falhou:", err);
    process.exit(1);
  });