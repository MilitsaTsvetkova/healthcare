import { ID, Query } from 'node-appwrite'
import { users } from '../appwrite.config'
import { parseStringify } from '../utils'

export const createUser = async (user: CreateUserParams) => {
  try {
    const { email, name, phone } = user
    const newUser = await users.create(
      ID.unique(),
      email,
      phone,
      undefined,
      name
    )
    return parseStringify(newUser)
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('$email', [user.email])])

      return documents?.users[0]
    }
    console.error(error)
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId)
    return parseStringify(user)
  } catch (error: any) {
    console.error(error)
  }
}
