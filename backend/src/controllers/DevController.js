const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../Utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

// index, show, store, update, destroy

module.exports = {
    async store(request, response) { 
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
            const { name = login, avatar_url, bio } = apiResponse.data
        
            const techsArray = parseStringAsArray(techs) //converte uma string com virgulas para um array
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            //filtrar as conexoes que estão a 10 km de distancia e que o novo dev tenha uma das techs filtradas
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )

            console.log(sendSocketMessageTo);
            sendMessage(sendSocketMessageTo, 'new-dev', dev)

        }
        return response.json(dev)
    },

    async index(request, response){
        const devs = await Dev.find()
        return response.json(devs)
    },

    async update(request, response){
        //atualizar um unico dev
        const { github_username, techs, bio } = request.body
        console.log('atualizando', request.body)
        let dev = await Dev.find({ 
            github_username: {
                $eq: github_username
            }
        })
        console.log('dev', dev)
        const techsArray = parseStringAsArray(techs)

        dev = await Dev.updateOne({
            techs: techsArray,
            bio
        })

        return response.json({ dev })
    },

    async destroy(request, response){
        const { github_username } = request.query

        console.log('Deleting ', github_username);

        dev = await Dev.findOneAndRemove({
            github_username
        })

        return response.json({ dev })
    },

}