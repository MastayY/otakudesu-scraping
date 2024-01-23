import { Router } from 'express'
import { home, completeAnimeList, onGoingAnimeList, schedules, genre, animeByGenre, search } from '../controllers/main.controller.js'
import { detailAnime, epsAnime } from '../controllers/anime.controller.js'

const router  = Router()

router.get('/home', home)
router.get('/completed',completeAnimeList)
router.get('/completed/page/:page',completeAnimeList)
router.get('/ongoing',onGoingAnimeList)
router.get('/ongoing/page/:page',onGoingAnimeList)
router.get('/schedule',schedules)
router.get('/genres',genre)
router.get('/genre/:id/page/:pageNumber',animeByGenre)
router.get('/search/:query',search)
router.get('/anime/:id',detailAnime)
router.get('/episode/:id',epsAnime)

export default router