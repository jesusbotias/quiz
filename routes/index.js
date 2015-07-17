var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');

/* GET home page. */
router.get('/', function(req, res, next ) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

// Ruta a los créditos

router.get('/author', function(req, res) {
	res.render('author', {errors: []});
});

module.exports = router;
