import { ServiceConstructor } from "."

const UserService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getUsers = (data = "", limit = 2, offset = 0) =>
    execute(instance.get(`/user?limit=${limit}&offset=${offset}${data}`))
  const getUser = (id) => execute(instance.get(`/user/${id}`))
  const createUser = (data) => execute(instance.post(`/user/signup`, data))
  const updateUser = (id, data) => execute(instance.put(`/user/${id}`, data))
  const deleteUser = (id) => execute(instance.delete(`/user/${id}`))

  // GROUP & FILTER
  const getGroupUsers = (data) => execute(instance.get(`/user?group=${data}`))
  const getFilterUsers = (data) => execute(instance.get(`/user/filter?${data}`))
  const getSearchUsers = (data) =>
    execute(
      instance.get(
        `/user/filter?alias=${data}&ref=${data}&name=${data}&email=${data}`
      )
    )

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,

    getGroupUsers,
    getSearchUsers,
    getFilterUsers
  }
}

export default UserService
