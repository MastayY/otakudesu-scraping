import express from 'express'
import router from './routes/index.js'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use('/api',router)
app.use('/',(req,res)=>{
    res.json({
        author: "MastayY",
        routes: {
            home: "/home",
            schedule: "/schedule",
            ongoing: "/ongoing/page/:page",
            completed: "/completed/page/:page",
            genreList: "/genres",
            genre: "/genres/:id/page/:page",
            search: "/search/:query",
            detailAnime: "/anime/:id",
            detailEpisode: "/episode/:id",
        },
    });
})
app.use('/api',(req,res) =>{
    res.send({
        message:'check our github for more info',
        github :'https://github.com/Kaede-No-Ki/otakudesu-rest-api'
    })
})


app.use('*',(req,res) =>{
    res.json({
        'status':'not found path',
        message: 'read the docs here https://github.com/Kaede-No-Ki/otakudesu-rest-api'
    })
})
app.listen(port, () => {
    console.log('listening on port', port)
})