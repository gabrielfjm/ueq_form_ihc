-- CreateEnum
CREATE TYPE "OrigemParticipacao" AS ENUM ('LINK', 'IMPORTADA');

-- AlterTable
ALTER TABLE "participacao" ADD COLUMN     "origem" "OrigemParticipacao" NOT NULL DEFAULT 'LINK',
ALTER COLUMN "idioma" DROP NOT NULL;
