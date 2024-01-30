const mongoose = require("mongoose");

const estacaoSchema = new mongoose.Schema({
    nome: String,
    endereco: String,
    localizacao: String,
    tiposDeMaterialReciclavel: String,
});

const Estacao = mongoose.model('Estacao', estacaoSchema);

module.exports = Estacao;