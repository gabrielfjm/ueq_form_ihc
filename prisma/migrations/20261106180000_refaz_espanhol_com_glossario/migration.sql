-- Os lotes escolhiam palavras diferentes para a mesma coisa (três traduções para "coleta", textos citando botões
-- com outro nome). Só o espanhol tinha sido traduzido: apagar refaz os textos com o glossário do idioma e os rótulos
DELETE FROM "traducao" WHERE "idioma" = 'es';
