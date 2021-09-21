import { ServiceConstructor } from "."

const UserService = () => {
  const { instance, execute } = ServiceConstructor

  const getUsers = (limit = 50, offset = 0) =>
    execute(instance.get(`/user?limit=${limit}&offset=${offset}`))
  const getUser = (id) => execute(instance.get(`/user/${id}`))
  const createUser = (data) => execute(instance.post(`/user/create`, data))
  const updateUser = (id, data) => execute(instance.put(`/user/${id}`, data))
  const deleteUser = (id) => execute(instance.delete(`/user/${id}`))

  return { getUsers, getUser, createUser, updateUser, deleteUser }
}

export default UserService
