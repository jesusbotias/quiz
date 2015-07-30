// Define la estructura de la tabla de quizes (preguntas) con 2 campos (tipo string):
// - pregunta: DataTypes.STRING                               
// - respuesta: DataTypes.STRING

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
            { pregunta:  DataTypes.STRING,
              respuesta: DataTypes.STRING,
            });
}
