import FilterService from "../../services/filter.service"

const useFilterApi = () => {
  const filterService = FilterService()

  const getFilterSimple = () => filterService.getFilterSimple()
  const getFilterComplex = () => filterService.getFilterComplex()
  const createFilter = (data) => filterService.createFilter(data)
  const updateFilter = (id, data) => filterService.updateFilter(id, data)
  const deleteFilter = (id) => filterService.deleteFilter(id)

  return {
    getFilterSimple,
    getFilterComplex,
    createFilter,
    updateFilter,
    deleteFilter
  }
}

export default useFilterApi
