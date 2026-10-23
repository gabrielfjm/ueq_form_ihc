-- CreateEnum
CREATE TYPE "StatusEstudo" AS ENUM ('RASCUNHO', 'ABERTO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "Escala" AS ENUM ('ATRATIVIDADE', 'PERSPICUIDADE', 'EFICIENCIA', 'CONFIABILIDADE', 'ESTIMULACAO', 'NOVIDADE');

-- CreateEnum
CREATE TYPE "Polaridade" AS ENUM ('POSITIVA_DIREITA', 'POSITIVA_ESQUERDA');

-- CreateTable
CREATE TABLE "pesquisador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesquisador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudo" (
    "id" TEXT NOT NULL,
    "pesquisador_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "produto_avaliado" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "status" "StatusEstudo" NOT NULL DEFAULT 'RASCUNHO',
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "slug_publico" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versao" (
    "id" TEXT NOT NULL,
    "estudo_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "versao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "termo_esquerdo" TEXT NOT NULL,
    "termo_direito" TEXT NOT NULL,
    "escala" "Escala" NOT NULL,
    "polaridade" "Polaridade" NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participacao" (
    "id" TEXT NOT NULL,
    "versao_id" TEXT NOT NULL,
    "consentiu_em" TIMESTAMP(3) NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concluida_em" TIMESTAMP(3),
    "demografia" JSONB,
    "suspeita" BOOLEAN NOT NULL DEFAULT false,
    "incluida_na_analise" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "participacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resposta" (
    "id" TEXT NOT NULL,
    "participacao_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,

    CONSTRAINT "resposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pesquisador_email_key" ON "pesquisador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudo_slug_publico_key" ON "estudo"("slug_publico");

-- CreateIndex
CREATE INDEX "estudo_pesquisador_id_idx" ON "estudo"("pesquisador_id");

-- CreateIndex
CREATE UNIQUE INDEX "versao_estudo_id_ordem_key" ON "versao"("estudo_id", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "item_numero_key" ON "item"("numero");

-- CreateIndex
CREATE INDEX "participacao_versao_id_idx" ON "participacao"("versao_id");

-- CreateIndex
CREATE UNIQUE INDEX "resposta_participacao_id_item_id_key" ON "resposta"("participacao_id", "item_id");

-- AddForeignKey
ALTER TABLE "estudo" ADD CONSTRAINT "estudo_pesquisador_id_fkey" FOREIGN KEY ("pesquisador_id") REFERENCES "pesquisador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versao" ADD CONSTRAINT "versao_estudo_id_fkey" FOREIGN KEY ("estudo_id") REFERENCES "estudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_versao_id_fkey" FOREIGN KEY ("versao_id") REFERENCES "versao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_participacao_id_fkey" FOREIGN KEY ("participacao_id") REFERENCES "participacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- O Prisma não declara CHECK no schema: o diferencial semântico do UEQ tem 7 posições
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_valor_entre_1_e_7" CHECK ("valor" BETWEEN 1 AND 7);
