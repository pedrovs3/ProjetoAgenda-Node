// Variaveis de ambiente
require('dotenv').config();
// Iniciando o Express
const express = require('express');
const app = express();
// Importaçao do mongoose (modelagem do banco, e garantir que os dados serao enviados da maneira como gostariamos)
const mongoose = require('mongoose');
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.emit('pronto');
  })
  .catch((e) => {
    console.error('Nao foi possivel conectar á base de dados');
  });

// Identificar navegador do cliente (salvando cookie no navegador)
const session = require('express-session');
// Garantir que sessoes sejam salvas no banco
const MongoStore = require('connect-mongo');
// Flash messages
const flash = require('connect-flash');

// Rotas da aplicaçao
const routes = require('./routes');
const path = require('path');
// Recomendaçao Express (Segurança)
const helmet = require('helmet');
// Csrf - tokens para formularios, nao permite que sites externos mandem coisa para a aplicaçao (segurança)
const csrf = require('csurf');

// Importaçao dos middlewares criados em outro arquivo
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require('./src/middlewares/middleware');

app.use(helmet({ contentSecurityPolicy: false }));

// Está dizendo que podemos postar um formulario para a nossa aplicaçao
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Arquivos estaticos da nossa aplicaçao e devem ser acessados, diretamente
app.use(express.static(path.resolve(__dirname, 'public')));

// Configurações de sessao
const sessionOptions = session({
  secret: 'asdadsjncsdncas',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

// Arquivos que sao renderizados na tela
app.set('views', path.resolve(__dirname, 'src', 'views'));

// Setando a engine de renderizaçao que sera utilizada
app.set('view engine', 'ejs');

// Configurando csrf token
app.use(csrf());

// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// Quando o app recebe o sinal 'Pronto' ele começa a iniciar o server na porta 3000
app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000 [ctrl + clique]');
    console.log('Servidor executando na porta 3000');
  });
});
