const mongoose = require('mongoose');
const validator = require('validator');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null
  }

  register() {
    this.validate();
  }

  validate () {
    // Validação 
    // O Email precisa ser valido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
    
    // A senha precisa ter entre 3 e 50 caracteres

    if (this.body.password.lenght < 3 || this.body.password.lenght > 50 ) this.errors.push('Senha inválida') 
  }

  cleanUp() {
    for (const key in this.body){
      if ( typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;