const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.json());

mongoose.connect('mongodb+srv://<user>:<senha>.713x21z.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
});

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const estacaoSchema = new Schema({
    nome: String,
    endereco: String,
    localizacao: String,
    tiposDeMaterialReciclavel: String,
});

const Estacao = mongoose.model('Estacao', estacaoSchema);

app.get('/reciclagem/estacoes', async (req, res) => {
    const estacoes = await Estacao.find();
    res.send(estacoes);
});

app.get('/reciclagem/estacao/:id', async (req, res) => {
    const estacao = await Estacao.find(req.params.id);
    return res.send(estacao);
});

app.get('/reciclagem/estatisticas', async (req, res) => {
    const { inicio, fim } = req.query;
    const estatisticas = await Estacao.collection.aggregate([
        {
            $lookup: {
                from: 'relatorios',
                localField: '_id',
                foreignField: 'estacaoId',
                as: 'relatorios',
            },
        },
        { $unwind: '$relatorios' },
        {
            $match: {
                'relatorios.data': { $gte: new Date(inicio), $lte: new Date(fim) },
            },
        },
        {
            $group: {
                _id: null,
                totalMaterialReciclado: { $sum: '$relatorios.quantidade' },
                reducaoEmissaoCarbono: { $sum: '$relatorios.reducaoEmissaoCarbono' },
            },
        },
    ]);
    res.send(estatisticas[0] || { totalMaterialReciclado: 0, reducaoEmissaoCarbono: 0 });
});


app.post("/reciclagem/estacoes", async (req, res) => {
    const novaEstacao = new Estacao({
        nome: req.body.nome,
        endereco: req.body.endereco,
        localizacao: req.body.localizacao,
        tiposDeMaterialReciclavel: req.body.tiposDeMaterialReciclavel,
    });
        const estacaoSalva = await novaEstacao.save();
        res.status(201).json(estacaoSalva);
});
app.put('/reciclagem/estacao/:id', async (req, res) => {
    const estacaoAtualizada = await Estacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(estacaoAtualizada);
});

app.delete('/reciclagem/estacao/:id', async (req, res) => {
    const estacoes = await Estacao.findByIdAndDelete(req.params.id);
        return res.send(estacoes);
});

app.listen(port, () => {
    console.log('App running');
});