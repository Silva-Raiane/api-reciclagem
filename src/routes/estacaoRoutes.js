const express = require("express");
const Estacao = require("../models/estacaoModel");
const app = express();
app.use(express.json());

const router = express.Router();

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


module.exports = router;