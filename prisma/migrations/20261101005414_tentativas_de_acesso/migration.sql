-- CreateTable
CREATE TABLE "tentativa_acesso" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tentativa_acesso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tentativa_acesso_chave_criada_em_idx" ON "tentativa_acesso"("chave", "criada_em");
