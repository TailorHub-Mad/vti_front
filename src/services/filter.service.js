import { ServiceConstructor } from "."

const FilterService = () => {
  const { instance, execute } = ServiceConstructor

  const getFilterSimple = (object) =>
    execute(instance.get(`/filter/simple?object=${object}`))
  const getFilterComplex = (object) =>
    execute(instance.get(`/filter/complex?object=${object}`))
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
