import mongoose, { Schema } from "mongoose";

const seguidorSchema = new Schema({
  idUsuario: { type: String, required: true },
  idUsuarioSeguido: { type: String, required: true },
});

export const SeguidorModel =
  mongoose.models.Seguidor || mongoose.model("Seguidor", seguidorSchema);