-- O termo de consentimento passa a dizer quem responde pela pesquisa, a instituição, os riscos, os benefícios
-- e, quando houver, o comitê de ética. Os estudos que já existem recebem o nome e o e-mail da conta do dono e
-- textos padrão de riscos e benefícios, que o pesquisador revisa em "Editar estudo"
ALTER TABLE "estudo"
  ADD COLUMN "responsavel_nome" TEXT,
  ADD COLUMN "responsavel_email" TEXT,
  ADD COLUMN "instituicao" TEXT,
  ADD COLUMN "riscos" TEXT,
  ADD COLUMN "beneficios" TEXT,
  ADD COLUMN "comite_etica" TEXT;

UPDATE "estudo" AS e
SET "responsavel_nome" = p."nome", "responsavel_email" = p."email"
FROM "pesquisador" AS p
WHERE p."id" = e."pesquisador_id";

UPDATE "estudo" SET
  "instituicao" = 'PPGIa · PUCPR',
  "riscos" = 'Os riscos são mínimos: responder pode cansar um pouco ou causar algum desconforto. Você pode parar a qualquer momento.',
  "beneficios" = 'Não há benefício direto para você. As respostas ajudam a melhorar o produto avaliado.';

ALTER TABLE "estudo"
  ALTER COLUMN "responsavel_nome" SET NOT NULL,
  ALTER COLUMN "responsavel_email" SET NOT NULL,
  ALTER COLUMN "instituicao" SET NOT NULL,
  ALTER COLUMN "riscos" SET NOT NULL,
  ALTER COLUMN "beneficios" SET NOT NULL;

ALTER TABLE "participacao" ADD COLUMN "menor_de_idade" BOOLEAN NOT NULL DEFAULT false;
