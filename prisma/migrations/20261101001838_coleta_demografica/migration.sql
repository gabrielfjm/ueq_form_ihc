-- AlterTable
ALTER TABLE "estudo" ADD COLUMN     "coletar_demografia" BOOLEAN NOT NULL DEFAULT false;

-- Estudos criados antes desta opção já mostravam a etapa "Dados opcionais": continuam mostrando
UPDATE "estudo" SET "coletar_demografia" = true;
