-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('CONVITE', 'RESPOSTA', 'ALTERACAO');

-- AlterTable
ALTER TABLE "pesquisador" ADD COLUMN     "notificacoes_por_email" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "notificacao" (
    "id" TEXT NOT NULL,
    "pesquisador_id" TEXT NOT NULL,
    "autor_id" TEXT,
    "estudo_id" TEXT,
    "colaboracao_id" TEXT,
    "tipo" "TipoNotificacao" NOT NULL,
    "texto" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lida_em" TIMESTAMP(3),

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificacao_pesquisador_id_lida_em_idx" ON "notificacao"("pesquisador_id", "lida_em");

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_pesquisador_id_fkey" FOREIGN KEY ("pesquisador_id") REFERENCES "pesquisador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "pesquisador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_estudo_id_fkey" FOREIGN KEY ("estudo_id") REFERENCES "estudo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
