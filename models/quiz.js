// Define la estructura de la tabla de quizes (preguntas) con 3 campos (tipo string):
// - pregunta: DataTypes.STRING
// - respuesta: DataTypes.STRING
// - tema: DataTypes.STRING

// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "--> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "--> Falta Respuesta"}}
      },
			tema: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "--> Falta Tema"}}
			}
    }
  );
}
