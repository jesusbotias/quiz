// Crea e inicializa la tabla 'Quiz' utilizando 'sequelize' //

// Construye la DB y el modelo importando (quiz.js)
// sequelize.sync() construye la DB según define el modelo.

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

//console.dir(process.env.DATABASE_URL);

var url      = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  {  dialect:  protocol,
     storage:  protocol,
     port:     port,
     host:     host,
     storage:  storage,    // solo SQLite (.env)
     omitNull: true        // solo Postgres
  }
);

// Importar la definicion de la tabla Quiz en quiz.js
//var quiz_path = path.join(__dirname, 'quiz');
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Exportar definición de tabla Quiz
exports.Quiz = Quiz;

// sequelice.sync() crea a inicializa tabla de preguntas en DB
// Crea automáticamente el fichero quiz.sqlite con la DB y sus datos iniciales, si la DB no existe.
// Si existe sincroniza con nuevas definiciones del modelo, siempre que sean compatibles con anteriores.
sequelize.sync().then(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){  // devuelve en 'count' el número de filas de la tabla.
    if (count === 0) {                 // la tabla se inicializa solo si está vacía
      Quiz.create({   pregunta: 'Capital de Italia',
                      respuesta: 'Roma'
      });
      Quiz.create({   pregunta: 'Capital de Francia',
                      respuesta: 'Paris'
      });
      Quiz.create({   pregunta: 'Capital de Portugal',
                      respuesta: 'Lisboa'
      })
     .then(function(){ console.log('Base de datos inicializada'); })
    };
  });
});
