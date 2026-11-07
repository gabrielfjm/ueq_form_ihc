-- O primeiro teste da tradução automática saiu com erros de sentido e sem a revisão. Só o espanhol tinha sido
-- traduzido: apagar faz os textos serem traduzidos de novo, com o glossário e a segunda leitura
DELETE FROM "traducao" WHERE "idioma" = 'es';
