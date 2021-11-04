import { Card } from "../Card"
import { TableCardFooter } from "./TableCardFooter/TableCardFooter"
import { TableCardHeader } from "./TableCardHeader/TableCardHeader"
import { TableCardInfo } from "./TableCardInfo/TableCardInfo"
import { TableCardTags } from "./TableCardTags/TableCardTags"

export const TableCard = ({ note, fromProjectDetail }) => {
  return (
    <Card>
      <TableCardHeader />
      <TableCardInfo marginBottom="18px" marginTop="6px" />
      <TableCardTags note={note} fromProjectDetail={fromProjectDetail} />
      <TableCardFooter marginTop="16px" />
    </Card>
  )
}
