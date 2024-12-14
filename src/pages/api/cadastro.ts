import { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import md5 from "md5";

const endpointCadastro = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
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

    const usuarioComMesmoEmail = await UsuarioModel.find({
      email: usuario.email
    });
    if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
      return res
        .status(400)
        .json({ erro: "Ja existe usuario com este email cadastrado" });
    }

    // Usuário salvo com a senha criptografada
    const usuarioASerSalvo = {
      nome: usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha)
    };

    await UsuarioModel.create(usuarioASerSalvo);
    return res.status(201).json({ msg: "Dados corretos" });
  }

  return res.status(500).json({ erro: "Metodo informado nao e valido" });
};

export default conectarMongoDB(endpointCadastro);
