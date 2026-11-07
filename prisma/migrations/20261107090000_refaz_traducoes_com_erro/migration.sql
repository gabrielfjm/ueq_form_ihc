-- A leitura das traduções achou erros que o glossário agora evita. O inglês é refeito inteiro; nos demais idiomas,
-- só os textos com "média" (podia virar "mediana") e os que ficaram em português ou citam botão com outro nome
DELETE FROM "traducao" WHERE "idioma" = 'en';
DELETE FROM "traducao" WHERE "idioma" IN ('fr', 'de', 'it', 'nl', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'sk', 'sl', 'hr', 'bs', 'hu', 'et', 'bg', 'ru', 'el', 'tr', 'id', 'ms', 'zh', 'ja', 'ko', 'th', 'hi', 'bn', 'mr', 'kn', 'ta', 'ar', 'he', 'fa') AND "hash_origem" IN ('300caa377760e34f', 'b95c4cfd42cad61b', 'fbfab0e42c0fbdc1', '056fb32f79820471', 'c1919f0be8519253', '3de1c9de977c20fe', 'a976494c0df072f0', '21da3f4645d626fe', '28cc733bfd77ff92', '43ea89976442ec6c', '5e83ca0a2643c9e4', 'c1356d09579b3e1d', 'ceaa22a3da19aab2', '91357b03b58a9d30', '1e8d68e8d4c46e74', '2e61a6de4881a057', '69a840f4c6a1b5ea', '9e38e5d04228c1ec', '1eb0dddc35c72163', '8505f1efd200e4ee', 'c9722d13a2018a02', 'c1927da96890d041', '1818c6a2856cdd1b', '03c73bd66f22e1b2', '6557b78486b3d527', 'fa6700a0ff678b5d', 'a3d352b7a9935041', 'f160cf1d43c939cd', 'ed318aef386f74b5', 'ffc961d972b137ca', '9bb93e7e7a20a8b5', 'a2d8cb66bf3db120', '47bfbf41a6f4bffd');
DELETE FROM "traducao" WHERE "idioma" = 'da' AND "hash_origem" IN ('790212fd4051d49f');
DELETE FROM "traducao" WHERE "idioma" = 'cs' AND "hash_origem" IN ('212284cc764432cb', 'b698e6f77d1f8274', '330f5ef99d3bd60a', 'd3746dcd06b352fb', '14d87727eb051593');
DELETE FROM "traducao" WHERE "idioma" = 'sk' AND "hash_origem" IN ('212284cc764432cb', 'b698e6f77d1f8274', '330f5ef99d3bd60a', 'd3746dcd06b352fb', '14d87727eb051593');
DELETE FROM "traducao" WHERE "idioma" = 'de' AND "hash_origem" IN ('4f3c7c1b916aa9d9');
DELETE FROM "traducao" WHERE "idioma" = 'nl' AND "hash_origem" IN ('b1837b5c44ef12b5');
DELETE FROM "traducao" WHERE "idioma" = 'id' AND "hash_origem" IN ('b1837b5c44ef12b5');
DELETE FROM "traducao" WHERE "idioma" = 'fi' AND "hash_origem" IN ('9b3ffe9903b1d6f6');
DELETE FROM "traducao" WHERE "idioma" = 'pl' AND "hash_origem" IN ('ceef86ebdad3e034', '9b3ffe9903b1d6f6', '2f70a2f99978926b');
DELETE FROM "traducao" WHERE "idioma" = 'sl' AND "hash_origem" IN ('3eb147607fe89a84');
