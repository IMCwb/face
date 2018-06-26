const Sequelize = require('sequelize')

const config = {
  db_host: '120.79.148.114',
  db_user: 'face_client1',
  db_password: 'password_face_client1',
  db_default_database: 'face',

  al_host: '120.79.57.154',
  al_path: '/face_recog/',
  al_method: 'POST',
  al_token: '1b9a5c4d73b2e45ff8477e554581f1ea',
}

exports.sequlize = new Sequelize(config.db_default_database, config.db_user, config.db_password, {
  host: config.db_host,
  dialect: 'mysql',
  operatorsAliases: false,
  // logging: false,
  pool: {
    max: 1000,
    min: 10,
    acquire: 30000,
    idle: 10000
  }
})

exports.Users
exports.Clues
exports.Losts
exports.Matchs


exports.init = () => {
  exports.Users = exports.sequlize.define('user', {
    user_id: { type: Sequelize.CHAR(30), primaryKey: true }
  })
  exports.Clues = exports.sequlize.define('clue', {
    clue_id: { type: Sequelize.INTEGER(30), primaryKey: true, autoIncrement: true },
    provider: { type: Sequelize.CHAR(30), primaryKey: true, references: { model: exports.Users, key: 'user_id' } },
    clue_info: { type: Sequelize.JSON, allowNull: false },
    clue_photos: { type: Sequelize.JSON, allowNull: true }
  })
  exports.Losts = exports.sequlize.define('lost', {
    lost_id: { type: Sequelize.INTEGER(30), primaryKey: true, autoIncrement: true },
    provider: { type: Sequelize.CHAR(30), allowNull: false, primaryKey: true, references: { model: exports.Users, key: 'user_id' } },
    lost_info: { type: Sequelize.JSON, allowNull: false },
    contact: { type: Sequelize.JSON, allowNull: false },
    lost_photos: { type: Sequelize.JSON, allowNull: true }
  })
  exports.Matchs = exports.sequlize.define('match', {
    lost_id: { type: Sequelize.INTEGER(30), primaryKey: true, references: { model: exports.Losts, key: 'lost_id' } },
    clue_id: { type: Sequelize.INTEGER(30), primaryKey: true, references: { model: exports.Clues, key: 'clue_id' } },
    possibility: { type: Sequelize.FLOAT, allowNull: false }
  })
  exports.sequlize.sync()
    .then(() => { })
    .catch(err => { console.error("[ERROR]", err) })
}
exports.match = () => {
}
