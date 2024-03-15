const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb+srv://HammerDB:ilZDLJ7nnXhnyd33@hammerdb.exwhvgw.mongodb.net/')
      .then((db: any) => console.log('DB is connected'))
  } catch (err) {
    console.error(err)
  }
}

export default dbConnection