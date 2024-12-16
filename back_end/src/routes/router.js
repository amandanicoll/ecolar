import express from 'express';
import db from '../db/mysql.js';

const app = express.Router();

// Rota para cadastrar um novo usuário
app.post('/usuarios/cadastrar', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    // Validação básica
    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
        // Verificar se o email já está cadastrado
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: "Este email já está cadastrado." });
        }

        // Inserir o novo usuário na tabela 'usuarios'
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)', 
            [nome, email, senha, tipo]
        );

        // Se for um ponto de coleta, inserir apenas o id_user na tabela 'pontos'
        if (tipo === "ponto") {
            await db.query(
                'INSERT INTO pontos (id_user) VALUES (?)', 
                [result.insertId]
            );
        }

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
});

//Rota de Login
app.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    // Verificar se o email e a senha foram fornecidos
    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        // Verificar se o usuário existe com o email fornecido
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Email ou senha inválidos." });
        }

        // Verificar se a senha fornecida corresponde à senha armazenada
        if (user[0].senha !== senha) {
            return res.status(400).json({ message: "Email ou senha inválidos." });
        }

        // Retornar os dados do usuário (sem senha) e uma mensagem de sucesso
        return res.status(200).json({
            message: "Login realizado com sucesso!",
            user: {
                id: user[0].id,
                nome: user[0].nome,
                tipo: user[0].tipo,
            },
        });

    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        return res.status(500).json({ message: "Erro ao tentar fazer login." });
    }
});

// Rota para buscar descartes
app.get('/api/descarte', async (req, res) => {
    const query = req.query.query || ''; // Obtém o parâmetro de consulta (se houver)

    try {
        let sql = 'SELECT material, descarte FROM descarte';
        let params = [];

        // Se houver um parâmetro de busca, filtra os resultados
        if (query) {
            sql += ' WHERE material LIKE ?';
            params.push(`%${query}%`);
        }

        // Consulta ao banco de dados
        const [results] = await db.query(sql, params);

        if (results.length === 0) {
            return res.status(404).json({ message: "Nenhum material encontrado." });
        }

        // Retorna os materiais encontrados
        return res.status(200).json(results);
    } catch (error) {
        console.error("Erro ao buscar materiais de descarte:", error);
        return res.status(500).json({ message: "Erro ao buscar materiais de descarte." });
    }
});

// Rota para buscar dados das comunidades
app.get('/api/comunidades', async (req, res) => {
    try {
      const [results] = await db.query('SELECT nome, categoria, contato, descricao, linkimg FROM grupos');
      if (results.length === 0) {
        return res.status(404).json({ message: 'Nenhuma comunidade encontrada.' });
      }
      res.status(200).json(results);
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
      res.status(500).json({ message: 'Erro ao buscar comunidades.' });
    }
  });
  
// Rota para buscar dados dos pontos de coleta
app.get('/api/pontos', async (req, res) => {
    try {
      const query = `
        SELECT 
          usuarios.nome AS nome, 
          pontos.material, 
          pontos.endereco, 
          pontos.responsavel, 
          pontos.contato, 
          pontos.linkmapa, 
          pontos.linkimg
        FROM pontos
        JOIN usuarios ON usuarios.id = pontos.id_user
      `;
  
      const [results] = await db.query(query);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Nenhum ponto de coleta encontrado.' });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Erro ao buscar pontos de coleta:', error);
      res.status(500).json({ message: 'Erro ao buscar pontos de coleta.' });
    }
  });
  
//Rota para buscar perfil
app.get('/api/usuario-perfil', async (req, res) => {
    const userId = req.query.userId; // Obtém o userId da query string
  
    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não fornecido.' });
    }
  
    try {
      const [user] = await db.query(
        'SELECT usuarios.nome, usuarios.email, pontos.material, pontos.endereco, pontos.responsavel, pontos.contato, pontos.linkmapa, pontos.linkimg FROM usuarios LEFT JOIN pontos ON usuarios.id = pontos.id_user WHERE usuarios.id = ?',
        [userId]
      );
  
      // Retornar um objeto vazio se nenhum usuário for encontrado
      if (!user.length) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      res.status(200).json(user[0]);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ message: 'Erro ao buscar dados do perfil.' });
    }
  });

//Rota para atualizar perfil 
app.put('/api/usuario-perfil', async (req, res) => {
  const { userId, nome, email, senha, material, endereco, responsavel, contato, linkmapa, linkimg } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
  }

  try {
    // Atualiza usuários: Se senha não foi enviada, mantém a senha antiga
    if (senha) {
      await db.query(
        'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?',
        [nome, email, senha, userId]
      );
    } else {
      await db.query(
        'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
        [nome, email, userId]
      );
    }

    // Atualiza pontos, se aplicável
    if (material || endereco || responsavel || contato || linkmapa || linkimg) {
      await db.query(
        'UPDATE pontos SET material = ?, endereco = ?, responsavel = ?, contato = ?, linkmapa = ?, linkimg = ? WHERE id_user = ?',
        [material, endereco, responsavel, contato, linkmapa, linkimg, userId]
      );
    }

    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
});
  
  
export default app;