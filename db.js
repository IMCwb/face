const Sequelize = require('sequelize')
const config = require('./config')
const sequlize = new Sequelize(config.db_default_database, config.db_user, config.db_password, {
  host: config.db_host,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 1000,
    min: 10,
    acquire: 30000,
    idle: 10000
  }
})
let _user, _clue, _lost, _match
_user = sequlize.define('user', {
  user_id: { type: Sequelize.CHAR(30), primaryKey: true }
})
_clue = sequlize.define('clue', {
  clue_id: { type: Sequelize.INTEGER(30), primaryKey: true },
  provider_id: { type: Sequelize.CHAR(30), primaryKey: true, references: { model: _user, key: 'user_id' } },
  clue_info: { type: Sequelize.JSON, allowNull: false },
  clue_photos: { type: Sequelize.JSON, allowNull: false }
})
_lost = sequlize.define('lost', {
  lost_id: { type: Sequelize.INTEGER(30), primaryKey: true },
  provider_id: { type: Sequelize.CHAR(30), allowNull: false, primaryKey: true, references: { model: _user, key: 'user_id' } },
  lost_info: { type: Sequelize.JSON, allowNull: false },
  contact: { type: Sequelize.JSON, allowNull: false },
  lost_photos: { type: Sequelize.JSON, allowNull: false }
})
_match = sequlize.define('match', {
  // uploader: { type: Sequelize.CHAR(30), allowNull: false, primaryKey: true, references: { model: _lost, key: 'provider_id' } },
  lost_id: { type: Sequelize.INTEGER(30), primaryKey: true, references: { model: _lost, key: 'lost_id' } },
  clue_id: { type: Sequelize.INTEGER(30), primaryKey: true, references: { model: _clue, key: 'clue_id' } },
  // provider_id: { type: Sequelize.CHAR(30), allowNull: false, primaryKey: true, references: { model: _clue, key: 'provider_id' } },
  possibility: { type: Sequelize.FLOAT, allowNull: false }
})

sequlize.sync()
  .then(() => {
  }
  )
  .catch(err => { console.error("[ERROR]", err) })

// sequlize.sync()
//   .then(_lost.findAll({
//     where: {
//       lost_id: 1
//     }
//   }).then(res => {
//     console.log(res[0].dataValues)
//   }))
