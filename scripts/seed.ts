import { hash } from "bcryptjs";
import { db } from "../src/db/client";
import { users } from "../src/db/schema";

async function seed() {
  const required = [
    "SEED_DAD_NAME",
    "SEED_MOM_NAME",
    "SEED_DAUGHTER_NAME",
    "SEED_DAD_PASSWORD",
    "SEED_MOM_PASSWORD",
  ] as const;

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }

  const [dadPasswordHash, momPasswordHash] = await Promise.all([
    hash(process.env.SEED_DAD_PASSWORD!, 10),
    hash(process.env.SEED_MOM_PASSWORD!, 10),
  ]);

  await db.insert(users).values([
    {
      name: process.env.SEED_DAD_NAME!,
      role: "dad",
      passwordHash: dadPasswordHash,
    },
    {
      name: process.env.SEED_MOM_NAME!,
      role: "mom",
      passwordHash: momPasswordHash,
    },
    {
      name: process.env.SEED_DAUGHTER_NAME!,
      role: "daughter",
      passwordHash: null,
    },
  ]);

  console.log("Familia creada correctamente.");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => process.exit(0));
