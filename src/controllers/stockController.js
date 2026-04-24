import * as stockService from '../services/stockService.js';

// LISTAR ESTOQUE
// export const getAll = async (req, res) => {
//   try {
//     const { store_id } = req.user
//     const { type } = req.query

//     const data = await stockService.getStock(store_id, type)

//     res.json(data)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: error.message })
//   }
// }

export const getAll = async (req, res) => {
  try {
    const { store_id, role } = req.user;
    const { type, store_id: storeIdQuery } = req.query;

    const data = await stockService.getStock(
      {
        user_store_id: store_id,
        role,
        store_id: storeIdQuery,
      },
      type
    );

    res.json(data);
  } catch (error) {
    console.error('🔥 ERRO GET STOCK:', error);
    res.status(500).json({ error: error.message });
  }
};

// LISTAR MOVIMENTOS
export const getMovements = async (req, res) => {
  try {
    const { store_id } = req.user;
    const { type } = req.query;

    const data = await stockService.getMovements(store_id, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MOVIMENTAÇÃO
export const moviment = async (req, res) => {
  try {
    console.log('📥 BODY RECEBIDO:', req.body);
    console.log('👤 USER:', req.user);

    const { item_id, quantity, type, reason, notes, item_type } = req.body;
    const { store_id, id: created_by } = req.user;

    if (!item_id || !quantity || !type || !item_type) {
      console.log('❌ VALIDAÇÃO FALHOU');
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    console.log('🚀 ENVIANDO PARA SERVICE:', {
      item_id,
      quantity,
      type,
      store_id,
      created_by,
      reason,
      notes,
      item_type,
    });

    const data = await stockService.movimentStock({
      item_id,
      quantity,
      type,
      store_id,
      created_by,
      reason,
      notes,
      item_type,
      reference_type: 'MANUAL',
    });

    console.log('✅ SUCESSO:', data);

    res.json(data);
  } catch (error) {
    console.error('🔥 ERRO NO CONTROLLER:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addMovement = async (req, res) => {
  try {
    const result = await stockService.addMovement(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const transferStock = async (req, res) => {
  try {
    const result = await stockService.transferStock(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
