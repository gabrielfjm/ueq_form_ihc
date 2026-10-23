-- CreateTable
CREATE TABLE "sessao" (
    "id" TEXT NOT NULL,
    "pesquisador_id" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessao_pesquisador_id_idx" ON "sessao"("pesquisador_id");

-- AddForeignKey
ALTER TABLE "sessao" ADD CONSTRAINT "sessao_pesquisador_id_fkey" FOREIGN KEY ("pesquisador_id") REFERENCES "pesquisador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
