// padroniza as responses para que não haja diversas types de erro e msg diferentes
export type RespostaPadraoMsg = {
  msg?: string;
  erro?: string;
};
