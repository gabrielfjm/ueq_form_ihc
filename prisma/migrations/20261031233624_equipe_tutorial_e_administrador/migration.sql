-- CreateEnum
CREATE TYPE "PapelColaborador" AS ENUM ('EDITOR', 'LEITOR');

-- CreateEnum
CREATE TYPE "StatusConvite" AS ENUM ('PENDENTE', 'ACEITO', 'RECUSADO');

-- AlterTable
ALTER TABLE "pesquisador" ADD COLUMN     "administrador" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tutorial_visto_em" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "colaboracao" (
    "id" TEXT NOT NULL,
    "estudo_id" TEXT NOT NULL,
    "pesquisador_id" TEXT NOT NULL,
    "convidado_por_id" TEXT,
    "papel" "PapelColaborador" NOT NULL DEFAULT 'EDITOR',
    "status" "StatusConvite" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondido_em" TIMESTAMP(3),

    CONSTRAINT "colaboracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "colaboracao_pesquisador_id_status_idx" ON "colaboracao"("pesquisador_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "colaboracao_estudo_id_pesquisador_id_key" ON "colaboracao"("estudo_id", "pesquisador_id");

-- AddForeignKey
ALTER TABLE "colaboracao" ADD CONSTRAINT "colaboracao_estudo_id_fkey" FOREIGN KEY ("estudo_id") REFERENCES "estudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboracao" ADD CONSTRAINT "colaboracao_pesquisador_id_fkey" FOREIGN KEY ("pesquisador_id") REFERENCES "pesquisador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboracao" ADD CONSTRAINT "colaboracao_convidado_por_id_fkey" FOREIGN KEY ("convidado_por_id") REFERENCES "pesquisador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Primeiro superusuário: a conta do Gabriel, criada em produção em 31/10/2026. Os próximos são
-- promovidos por um administrador na página Administração. Onde a conta não existe, não faz nada
UPDATE "pesquisador" SET "administrador" = true WHERE "email" = 'gabrielfjmeira@gmail.com';
