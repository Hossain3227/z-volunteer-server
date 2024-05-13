const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()

const corOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corOptions))
  app.use(express.json())

  app.listen(port, () => console.log(`server is running on port ${port}`))