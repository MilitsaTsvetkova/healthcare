import { ID, Query } from 'node-appwrite'
import { users } from '../appwrite.config'

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
    return newUser
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('$email', [user.email])])

      return documents?.users[0]
    }
    console.error(error)
  }
}
