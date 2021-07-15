import { Flex, Grid, Table, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { getDisplayName } from "next/dist/next-server/lib/utils"
import React from "react"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/layout"
import { getPercentage } from "../../../utils/functions/calculations"
import { Card } from "../../layout/Card/Card"
import { ProjectTag } from "../../tags/ProjectTag/ProjectTag"

export const UserTable = () => {
  const calcProp = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`
  const table_gen = {
    components: {
      text: <Text />,
      actions: <h1>Actions</h1>,
      departamento: <ProjectTag />,
      pfocal_proyectos: <Text />,
      proyectos_comentados: <Text />,
      options: <h1>Options</h1>,
    },
    head: {
      actions: {
        label: "",
        width: calcProp(32),
        type: "component",
      },
      id: {
        label: "id",
        width: calcProp(85),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcProp(85),
        type: "text",
      },
      nombre: {
        label: "Nombre",
        width: calcProp(140),
        type: "text",
      },
      email: {
        label: "Email",
        width: calcProp(180),
        type: "text",
      },
      departamento: {
        label: "Departamento",
        width: calcProp(90),
        type: "component",
      },
      pfocal_proyectos: {
        label: "Punto focal proyectos",
        width: calcProp(200),
        type: "component",
      },
      proyectos_comentados: {
        label: "Proyectos comentados",
        width: calcProp(280),
        type: "component",
      },
      options: {
        label: "",
        width: calcProp(20),
        type: "component",
      },
    },
    items: new Array(30).fill({
      actions: "",
      id: "ID001",
      alias: "US001",
      nombre: "Nombre y apellido",
      email: "nombreemail@vtisl.com",
      departamento: "Ingenieria",
      pfocal_proyectos: ["Proyecto1", "Proyecto2"],
      proyectos_comentados: ["Proyecto1", "Proyecto2"],
      options: "",
    }),
  }
  const templateColumns = Object.values(table_gen.head).reduce(
    (ac, cv) => (ac = `${ac} ${cv.width}`),
    ""
  )

  return (
    <Card width="100%" maxWidth="2400px" position="relative">
      <Flex overflow="scroll" width="100%" maxHeight="90vh" position="relative">
        <Grid minWidth={MIN_TABLE_WIDTH} maxWidth={MAX_TABLE_WIDTH} width="100%">
          <Grid
            templateColumns={templateColumns}
            borderBottom="1px"
            borderColor="grey"
            padding="8px 0"
            width="100%"
            position="sticky"
            top="0"
            left="0"
            bgColor="white"
            zIndex="1"
            alignItems="center"
            minWidth={MIN_TABLE_WIDTH}
            maxWidth={MAX_TABLE_WIDTH}
          >
            {Object.values(table_gen.head).map((element) => (
              <Text key={element.label}>{element.label}</Text>
            ))}
          </Grid>
          {table_gen.items.map((item) => {
            return (
              <Grid
                key={item.id}
                templateColumns={templateColumns}
                borderBottom="1px"
                borderColor="grey"
                height="60px"
                width="100%"
                alignItems="center"
                _hover={{ bgColor: "#FAFAFA" }}
              >
                {Object.entries(item).map(([name, element]) => {
                  if (table_gen.head[name].type === "text") {
                    return React.cloneElement(table_gen.components.text, {
                      children: element.toString(),
                    })
                  }
                  if (table_gen.components[name] !== undefined) {
                    return React.cloneElement(table_gen.components[name], {
                      children: element.toString(),
                    })
                  }
                  return <Text key={name} />
                })}
              </Grid>
            )
          })}
        </Grid>
      </Flex>
    </Card>
  )
}
