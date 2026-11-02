-- AlterTable
ALTER TABLE "estudo" ADD COLUMN     "idioma" TEXT NOT NULL DEFAULT 'pt';

-- AlterTable
ALTER TABLE "pesquisador" ADD COLUMN     "idioma" TEXT NOT NULL DEFAULT 'pt';

-- CreateTable
CREATE TABLE "traducao" (
    "id" TEXT NOT NULL,
    "idioma" TEXT NOT NULL,
    "hash_origem" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traducao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "traducao_idioma_hash_origem_key" ON "traducao"("idioma", "hash_origem");
