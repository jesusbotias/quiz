// El controlador importa el modelo para poder acceder a DB.
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  // Con los métodos models.Quiz.findAll() o find()
  // buscamos los datos en la tabla Quiz y los procesamos en el callback del método success(..).
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next (new Error('No existe quizId = ' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function (req, res){
  var textoresp = "No se han encontrado preguntas."
  if (req.query.search){
    var search = '%' + req.query.search.replace(' ', '%') + '%';
    models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
      function(quizes){
        if (quizes){
          textoresp = 'Se han encontrado ' + quizes.length + ' preguntas con el término: ' + req.query.search;
        }
        //res.render('quizes/index.ejs', {quizes: quizes, textoresp: textoresp})
        res.render('quizes/index.ejs', {quizes: quizes, textoresp: textoresp, errors: []})
      }
    ).catch (function(error){next(error);});
  }
  else{
    models.Quiz.findAll().then(
      function (quizes){
        var textoresp = 'Se han encontrado ' + quizes.length + ' preguntas';
        res.render('quizes/index.ejs', {quizes: quizes, textoresp: textoresp, errors: []});
      }
    ).catch (function(error){next(error);});
  }

};

/*exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes });
  })
};*/

// Paso 1: Adaptar MVC de pregunta y respuesta a colección de recursos
// a: Cambiar en controlador quiz_controller.js: question por show y modificar answer
// GET /quizes/:id
exports.show = function (req,res){
    res.render('quizes/show', { quiz: req.quiz , errors: []});
};

// GET /quizes/:id/answer
exports.answer = function (req, res){

  //models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
      res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Correcto', errors: []} );
    } else {
      res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors: []} );
    }
  //})
};

// GET /quizes/new
exports.new = function (req, res){
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req,res){
  var quiz = models.Quiz.build( req.body.quiz );

  // Guarda en la BBDD los campos pregunta y respuesta:
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
           // save: guarda en DB campos pregunta y respuesta de quiz
        quiz
        .save({fields: ["pregunta", "respuesta"]}).then( function(){
          res.redirect('/quizes');
        })
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

// PUT /quizes/:id
exports.update = function (req,res){
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz      // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})
      }      // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

exports.destroy = function(req,res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function (req,res){
  var quiz = req.quiz; // autoload de instanciade quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};
