const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController')

// Rotas da home
// Rota escolhe o controller e o controller escolhe qual model e view será utilizada para a rota
route.get('/', homeController.paginaInicial);
route.post('/', homeController.trataPost);

//Rotas de contato
route.get('/contato', contatoController.paginaInicial)

// Exportando as routes definidas nesse arquivo para serem acessadas em server.js
module.exports = route;