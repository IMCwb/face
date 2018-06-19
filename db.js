//用sequelize重构了一遍数据层
const Sequelize = require('sequelize')
const config = require('./config')
const sequlize = new Sequelize(config.db_default_database, config.db_user, config.db_password, {
  host: config.db_host,
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false,
  pool: {
    max: 1000,
    min: 10,
    acquire: 30000,
    idle: 10000
  }
})

var _user = sequlize.define('user', {
  user_id: { type: Sequelize.CHAR(30), allowNull: false }
})
var _clue_photo = sequlize.define('clue_photo', {
  image_id: { type: Sequelize.INTEGER(30) },
  clue_id: { type: Sequelize.INTEGER(30).UNSIGNED, allowNull: fasle },
  images: { type: Sequelize.JSON, allowNull: false },
  eigen_vectors: { type: Sequelize.JSON, allowNull: true }
})
var _lost_photo = sequlize.define('lost_photo', {
  image_id: { type: Sequelize.INTEGER(30), autoIncrement: true, allowNull: false, primaryKey: true},
  lost_id: { type: Sequelize.INTEGER(30).UNSIGNED, allowNull: false, references: _lost },
  images: { type: Sequelize.JSON, allowNull: false },
  eigen_vectors: { type: Sequelize.JSON, allowNull: true }
})
var _clue = sequlize.define('clue', {
  clue_id: {}
})
var _lost = sequlize.define('lost', {
  lost_id: { type: Sequelize.INTEGER(30), autoIncrement: true, primaryKey: true },
  provider_id: { type: Sequelize.CHAR(30), allowNull: false },
  name: { type: Sequelize.CHAR(20), allowNull: false },
  gender: { type: Sequelize.INTEGER(1), allowNull: false },
  birthday: { type: Sequelize.DATE, allowNull: true },
  person_location: { type: Sequelize.CHAR(100), allowNull: true },
  contact: { type: Sequelize.BIGINT(20), allowNull: false },
  contact_name: { type: Sequelize.CHAR(20), allowNull: false },
  description: { type: Sequelize.TEXT, allowNull: true },
  last_location: { type: Sequelize.CHAR(100), allowNull: true },
  since: { type: Sequelize.DATE, allowNull: true },
})
var _match

exports.init = () => {

}
// sequlize
//   .authenticate()
//   .then(() => {
//     console.log("success")
//   })
//   .catch(err => {
//     console.error("[ERROR]", err)
//   })

// sequlize.sync()
//   .then(Lost.create({
//     lost_id: 5,
//     provider_id: 1,
//     name: '陈文彬',
//     gender: 1,
//     birthday: new Date(1998, 1, 14),
//     person_location: '广东省韶关市',
//     contact: 13416349304,
//     contact_name: '陈文彬',
//     description: '123123123',
//     last_location: '456456456',
//     since: new Date(2018, 6, 19)
//   }))
//   .catch(err => {
//     console.err("ERROR: ", err)
//   })

sequlize.sync()
  .then(_lost.findAll({
    where: {
      lost_id: 1
    }
  }).then(res => {
    console.log(res[0].dataValues)
  }))