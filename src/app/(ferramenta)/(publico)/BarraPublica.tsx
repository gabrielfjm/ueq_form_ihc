import { BookOpen, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Logotipo } from "@/componentes/Logotipo";
import { BarraFixa } from "../(pesquisador)/BarraFixa";
import estilos from "../(pesquisador)/pesquisador.module.css";

// Protótipo r13 (sem login): a mesma barra do pesquisador, só com o que quem não tem conta pode fazer
export function BarraPublica() {
  return (
    <BarraFixa
      inicio={
        <Link href="/documentacao" className={estilos.inicio}>
          <Logotipo />
        </Link>
      }
    >
      <Link href="/documentacao" className={estilos.linkNavegacao} aria-current="page">
        <BookOpen size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Documentação</span>
      </Link>
      <Link href="/entrar" className={estilos.linkNavegacao}>
        <LogIn size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Entrar</span>
      </Link>
      <Link href="/cadastrar" className={estilos.linkNavegacao}>
        <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Criar conta</span>
      </Link>
    </BarraFixa>
  );
}
