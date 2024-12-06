import { NextApiRequest, NextApiResponse } from "next";
import { respostaPadraoMsg } from "../../../types/respostaPadraoMsg";
import { CadastroRequisicao } from "../../../types/CadastroRequisicao";

const endpointCadastro = (
  req: NextApiRequest,
  res: NextApiResponse<respostaPadraoMsg>
) => {
  if (req.method === "POST") {
    const usuario = req.body as CadastroRequisicao;

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ erro: "Nome invalido" });
    }

    if (
      !usuario.email ||
      usuario.email.length < 5 ||
      !usuario.email.includes("@") ||
      !usuario.email.includes(".")
    ) {
      return res.status(400).json({ erro: "Email invalido" });
    }

    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ erro: "Senha invalida" });
    }

    return res.status(200).json({ msg: "Dados corretos" });
  }

  return res.status(500).json({ erro: "Metodo informado nao e valido" });
};

export default endpointCadastro;
