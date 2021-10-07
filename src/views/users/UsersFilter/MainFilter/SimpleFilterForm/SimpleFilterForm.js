import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../../components/forms/AddSelect/AddSelect"
import useUserApi from "../../../../../hooks/api/useUserApi"
import useProjectApi from "../../../../../hooks/api/useProjectApi"
import useDepartmentApi from "../../../../../hooks/api/useDepartmentApi"

export const SimpleFilterForm = ({ value, onChange }) => {
  const { getUsers } = useUserApi()
  const { getProjects } = useProjectApi()
  const { getDepartments } = useDepartmentApi()

  // Filter Options
  const [projectsOpt, setProjectsOpt] = useState(null)
  const [departmentOpt, setDepartmentOpt] = useState(null)
  const [usersOpt, setUsersOpt] = useState(null)

  useEffect(() => {
    if (!projectsOpt) {
      const fetchProjects = async () => {
        const data = await getProjects()
        setProjectsOpt(
          data[0]?.projects.map((ts) => ({ label: ts.alias, value: ts._id }))
        )
      }
      fetchProjects()
    }
  }, [projectsOpt])

  useEffect(() => {
    if (!departmentOpt) {
      const fetchDepartments = async () => {
        const data = await getDepartments()
        setDepartmentOpt(data.map((dp) => ({ label: dp.name, value: dp._id })))
      }
      fetchDepartments()
    }
  }, [departmentOpt])

  useEffect(() => {
    if (!usersOpt) {
      const fetchUsers = async () => {
        const data = await getUsers()
        setUsersOpt(data.map((us) => ({ label: us.alias, value: us._id })))
      }
      fetchUsers()
    }
  }, [usersOpt])

  const filterInputs = {
    project: {
      type: "add_select",
      config: {
        placeholder: "Proyecto",
        options: projectsOpt,
        label: "Departamento"
      }
    },
    department: {
      type: "add_select",
      config: {
        placeholder: "Departamento",
        options: departmentOpt,
        label: "Departamento"
      }
    },
    focus_point: {
      type: "add_select",
      config: {
        placeholder: "Nombre",
        options: usersOpt,
        label: "Punto focal"
      }
    }
  }

  const inputRefObj = {
    add_select: <AddSelect />
  }

  const handleFilterChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _value.target.checked : _value
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }], idx) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFilterChange(name, val),
          marginBottom: "24px",
          key: `${name}-${idx}`,
          ...config
        })
      })}
    </>
  )
}
