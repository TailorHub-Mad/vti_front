import { ServiceConstructor } from "."

const FilterService = () => {
  const { instance, execute } = ServiceConstructor

  const getFilterSimple = () => execute(instance.get(`/filter/simple`))
  const getFilterComplex = () => execute(instance.get(`/filter/complex`))
  const createFilter = (data) => execute(instance.post(`/filter`, data))
  const updateFilter = (id, data) => execute(instance.put(`/filter/${id}`, data))
  const deleteFilter = (id) => execute(instance.delete(`/filter/delete/${id}`))

  return {
    getFilterSimple,
    getFilterComplex,
    createFilter,
    updateFilter,
    deleteFilter
  }
}

export default FilterService
