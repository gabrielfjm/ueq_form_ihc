import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO } from "@/lib/cookie-sessao";

// Checagem otimista: só olha se há cookie de sessão. Cada página e ação do pesquisador confere
// a sessão no banco com exigirPesquisador, então um cookie inválido não passa dali
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/" || request.cookies.has(COOKIE_SESSAO)) return NextResponse.next();

  const entrar = new URL("/entrar", request.url);
  entrar.searchParams.set("voltar", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(entrar);
}

// Tudo é da área do pesquisador, menos as páginas de acesso e as do participante (/r/...),
// que nunca exigem sessão. Rota nova do pesquisador já nasce protegida
export const config = {
  matcher: ["/((?!entrar|cadastrar|r/|_next/|favicon.ico).*)"],
};
