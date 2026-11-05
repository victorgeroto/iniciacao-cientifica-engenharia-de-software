/** Formato neutro de requisição/resposta: os controllers não conhecem o Express. */
export interface HttpRequest {
  body?: unknown;
  params: Record<string, string>;
  userId?: number;
}

export interface HttpResponse {
  status: number;
  body?: unknown;
}
