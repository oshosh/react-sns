const express = require('express')

const router = express.Router();

router.post('/', (req, res) => { // POST /post
    res.json(
        {
            id: 1,
            content: 'hello1'
        },
    )
});

router.delete('/', (req, res) => { // DELETE /post
    res.json(
        {
            id: 1,
        },
    )
});

module.exports = router;
//npm i sequelize sequelize-cli mysql2
//npx sequelize init