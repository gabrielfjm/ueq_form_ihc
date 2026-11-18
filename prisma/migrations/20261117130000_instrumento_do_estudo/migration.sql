-- UEQ-S (RF62): o estudo escolhe o questionário completo ou a versão curta. Os estudos que já existem são do UEQ
CREATE TYPE "Instrumento" AS ENUM ('UEQ', 'UEQ_S');

ALTER TABLE "estudo" ADD COLUMN "instrumento" "Instrumento" NOT NULL DEFAULT 'UEQ';
