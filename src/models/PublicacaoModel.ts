import mongoose, { Schema } from "mongoose";

const publicacaoSchema = new Schema({
  idUsuario: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: { type: String, required: true },
  data: { type: Date, required: true },
  comentarios: { type: Array, required: true, default: [] },
  likes: { type: Array, required: true, default: [] }
});

export const PublicacaoModel =
  mongoose.models.Publicacoes || mongoose.model("Publicacoes", publicacaoSchema);
