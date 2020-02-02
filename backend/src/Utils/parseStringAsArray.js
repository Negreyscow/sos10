module.exports = function parseStringAsArray(arrayAsString){
    return arrayAsString.split(',').map(e => e.trim())
}