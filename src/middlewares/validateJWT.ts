const jwt = require('jsonwebtoken')

const validateJWT = (hash: string) => {
  try {
    const { uid, first_name, last_name, email } = jwt.verify(hash, process.env.JWT_KEY_PASS! as string)

    return { uid, first_name, last_name, email }
  } catch (err) {
    console.error(err)
  }
}

export default validateJWT