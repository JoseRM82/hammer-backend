const jwt = require('jsonwebtoken')


const createJWT = (uid: string, firstName: string, lastName: string, email: string) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, firstName, lastName, email }
    jwt.sign(payload, process.env.JWT_KEY_PASS as string, { expiresIn: '30d' }, (err: any, token: string) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export default createJWT