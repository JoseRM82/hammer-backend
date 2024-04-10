const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_ACC)
      .then((db: any) => console.log('DB is connected'))
  } catch (err) {
    console.error(err)
  }
}

export default dbConnection