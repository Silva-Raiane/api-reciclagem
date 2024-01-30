const Estacao = require("../models/estacaoModel");

const getEstacoes = async (req, res) => {
        const estacoes = await Estacao.find();
        res.json(estacoes);
};
const getEstacaoById = async (req, res) => {
        const estacao = await Estacao.findById(req.params.id);
        res.json(estacao);
}
const createEstacao = async (req, res) => {
        const novaEstacao = new Estacao({
            nome: req.body.nome,
            endereco: req.body.endereco,
            localizacao: req.body.localizacao,
            tiposDeMaterialReciclavel: req.body.tiposDeMaterialReciclavel,
        });
        const estacaoSalva = await novaEstacao.save();
        res.send(estacaoSalva);
};

const updateEstacao = async (req, res) => {
        const estacaoAtualizada = await Estacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
         return res.json(estacaoAtualizada);
};

const deleteEstacao = async (req, res) => {
        const estacaoRemovida = await Estacao.findByIdAndDelete(req.params.id);
        if (!estacaoRemovida) {
            return res.status(404).json({ message: 'Estação não encontrada' });
        }
        res.json(estacaoRemovida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getEstacoes,
    getEstacaoById,
    getEstatisticas,
    createEstacao,
    updateEstacao,
    deleteEstacao,
}