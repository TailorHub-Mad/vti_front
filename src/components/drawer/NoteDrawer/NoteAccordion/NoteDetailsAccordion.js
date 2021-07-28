import { Accordion, Button } from "@chakra-ui/react"
import React from "react"
import { CloudLineIcon } from "../../../icons/CloudLineIcon"
import { ImageTypeIcon } from "../../../icons/ImageTypeIcon"
import { LinkLineIcon } from "../../../icons/LinkLineIcon"
import { PageLineIcon } from "../../../icons/PageLineIcon"
import { PdfTypeIcon } from "../../../icons/PdfTypeIcon"
import { TagLineIcon } from "../../../icons/TagLineIcon"
import { TestSystemLineIcon } from "../../../icons/TestSystemLineIcon"
import { TestSystemTag } from "../../../tags/TestSystemTag/TestSystemTag"
import { NoteAccordionItem } from "./NoteAccordionItem/NoteAccordionItem"

export const NoteDetailsAccordion = ({
  name,
  noteTags,
  testSystems,
  links,
  message,
  files,
  ...props
}) => {
  return (
    <Accordion allowToggle allowMultiple {...props}>
      <NoteAccordionItem
        title="Sistema de ensayo del proyecto"
        icon={<TestSystemLineIcon mr="8px" />}
      >
        {testSystems.map((ts) => (
          <Button key={ts} variant="note_content" mr="8px" mb="8px">
            {ts}
          </Button>
        ))}
      </NoteAccordionItem>
      <NoteAccordionItem title="Tags de apunte" icon={<TagLineIcon mr="8px" />}>
        {noteTags.map((note) => (
          <TestSystemTag key={note} mr="8px" mb="8px">
            {note}
          </TestSystemTag>
        ))}
      </NoteAccordionItem>
      <NoteAccordionItem
        title={`Mensaje creado por ${name}`}
        icon={<PageLineIcon mr="8px" />}
      >
        {message}
      </NoteAccordionItem>
      <NoteAccordionItem title="Link" icon={<LinkLineIcon mr="8px" />}>
        {links.map((link) => (
          <Button key={link} variant="note_content" mr="8px" mb="8px">
            <LinkLineIcon width="16px" />
            {link}
          </Button>
        ))}
      </NoteAccordionItem>
      <NoteAccordionItem title="Adjuntos" icon={<CloudLineIcon mr="8px" />}>
        {files.map((file) => (
          <Button key={file.name} variant="note_content" mr="8px" mb="8px">
            {file.type === "image" ? <ImageTypeIcon /> : <PdfTypeIcon />}
            {file.name}
          </Button>
        ))}
      </NoteAccordionItem>
    </Accordion>
  )
}
