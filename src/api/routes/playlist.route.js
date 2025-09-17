const Router = require("express");
const {getPlaylistSuggestions} = require('../controllers/playlist.controller');

const router = Router();

router.get("/suggestion" , getPlaylistSuggestions);

module.exports = router;