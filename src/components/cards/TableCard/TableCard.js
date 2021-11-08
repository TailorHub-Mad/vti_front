import { useRouter } from "next/router"
import { useContext } from "react"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { PATHS } from "../../../utils/constants/global"
import { Card } from "../Card"
import { TableCardFooter } from "./TableCardFooter/TableCardFooter"
import { TableCardHeader } from "./TableCardHeader/TableCardHeader"
import { TableCardInfo } from "./TableCardInfo/TableCardInfo"
import { TableCardTags } from "./TableCardTags/TableCardTags"

export const TableCard = ({ item, onSubscribe, onFavorite, type }) => {
  const { user } = useContext(ApiAuthContext)
  const router = useRouter()

  console.log(type, onFavorite, onSubscribe)

  const checkIsFavorite = (id) =>
    type === "projects"
      ? user?.favorites?.projects?.includes(id)
      : user?.favorites?.testSystems?.includes(id)
  const checkIsSubscribe = (id) =>
    type === "projects"
      ? user?.subscribed?.projects?.includes(id)
      : user?.subscribed?.testSystems?.includes(id)
  return (
    <Card>
      <TableCardHeader
        isFavorite={checkIsFavorite(item._id)}
        isSubscribe={checkIsSubscribe(item._id)}
        title={item.alias}
        onClick={() =>
          router.push(
            `${type === "projects" ? PATHS.projects : PATHS.testSystems}/${item._id}`
          )
        }
        onSubscribe={(state) => onSubscribe(item._id, state)}
        onFavorite={(state) => onFavorite(item._id, state)}
        type={type}
      />
      <TableCardInfo
        client={item.clientAlias}
        sector={type === "projects" ? item?.sector[0]?.title : null}
        updatedAt={new Date(item.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <TableCardTags
        testSystems={type === "projects" ? item.testSystems : null}
        tags={type === "projects" ? item.tags : null}
        projects={type === "testSystems" ? item.projects : null}
        notes={type === "testSystems" ? item.notes : null}
        type={type}
      />
      {type === "projects" && (
        <TableCardFooter
          users={item.users.length}
          notes={item.notes.length}
          marginTop="16px"
        />
      )}
    </Card>
  )
}
