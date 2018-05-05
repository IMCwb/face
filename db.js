const mysql = require('mysql')

exports.new_lost = () => {
    console.log('new lost')
    return 'lost_1'
}

exports.new_clue = () => {
    console.log('new clue')
    return 'clue_1'
}

exports.new_pic = () => {
    console.log('new picture')
}
