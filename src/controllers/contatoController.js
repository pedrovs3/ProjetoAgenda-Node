/**
 * Objetivo: Arquivo responsavel pela chamada do model de Contato.
 * Autor: Pedro Henrique Vieira
 */

const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);

      req.session.save(() => res.redirect('/contato'));
      return;
    }

    req.flash('success', 'Contato cadastrado com sucesso.');

    req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404');

  const contato = await Contato.searchById(req.params.id);
  if (!contato) return res.render('404');

  res.render('contato', { contato });
};

exports.edit = async function (req, res) {
  if (!req.params.id) return res.render('404');

  try {
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect(`/contato/${req.params.id}`));
      return;
    }

    req.flash('success', 'Contato atualizado com sucesso.');
    req.session.save(() => res.redirect('back'));
    return;
  } catch (e) {
    console.log(e);
    req.session.save(() => res.render('404'));
  }
};

exports.delete = async (req, res) => {
  if (!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if (!contato) return res.render('404');

  req.flash('success', 'Contato apagado com sucesso');
  req.session.save(() => res.redirect('back'));
  return;
};
