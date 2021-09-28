import { Accordion, Button } from "@chakra-ui/react"
import React from "react"
import {
  formatTags,
  getRemainingTags,
  variantGeneralTag
} from "../../../../utils/constants/tabs"
import { CloudLineIcon } from "../../../icons/CloudLineIcon"
import { ConversationIcon } from "../../../icons/ConversationIcon"
import { ImageTypeIcon } from "../../../icons/ImageTypeIcon"
import { LinkLineIcon } from "../../../icons/LinkLineIcon"
import { PageLineIcon } from "../../../icons/PageLineIcon"
import { PdfTypeIcon } from "../../../icons/PdfTypeIcon"
import { TagLineIcon } from "../../../icons/TagLineIcon"
import { TestSystemLineIcon } from "../../../icons/TestSystemLineIcon"
import { TagRow } from "../../../tags/TagRow/TagRow"
import { NoteAccordionItem } from "./NoteAccordionItem/NoteAccordionItem"

export const NoteDetailsAccordion = ({
  name,
  noteTags,
  testSystems,
  link,
  message,
  files,
  isMessage,
  ...props
}) => {
  return (
    <Accordion allowToggle allowMultiple {...props}>
      {!isMessage && testSystems ? (
        <NoteAccordionItem
          title="Sistema de ensayo del proyecto"
          icon={<TestSystemLineIcon mr="8px" />}
        >
          {testSystems.map((ts, idx) => (
            <Button key={`${ts}-${idx}`} variant="note_content" mr="8px" mb="8px">
              {ts}
            </Button>
          ))}
        </NoteAccordionItem>
      ) : null}

      {!isMessage && noteTags ? (
        <NoteAccordionItem title="Tags de apunte" icon={<TagLineIcon mr="8px" />}>
          <TagRow
            tags={formatTags(noteTags, "name")}
            variant={variantGeneralTag.NOTE}
            remainingTagsCount={getRemainingTags(noteTags)}
          />
        </NoteAccordionItem>
      ) : null}

      {message ? (
        <NoteAccordionItem
          title={`${isMessage ? "Respuesta" : "Mensaje creado"} por ${name}`}
          icon={
            isMessage ? <ConversationIcon mr="8px" /> : <PageLineIcon mr="8px" />
          }
        >
          {message}
        </NoteAccordionItem>
      ) : null}

      {link ? (
        <NoteAccordionItem title="Link" icon={<LinkLineIcon mr="8px" />}>
          <Button variant="note_content" mr="8px" mb="8px">
            <LinkLineIcon width="16px" />
            {link}
          </Button>
        </NoteAccordionItem>
      ) : null}

      {files ? (
        <NoteAccordionItem title="Adjuntos" icon={<CloudLineIcon mr="8px" />}>
          {files.map((file, idx) => (
            <Button
              key={`${file.name}-${idx}`}
              variant="note_content"
              mr="8px"
              mb="8px"
            >
              {file.type === "image" ? <ImageTypeIcon /> : <PdfTypeIcon />}
              {file.name}
            </Button>
          ))}
        </NoteAccordionItem>
      ) : null}
    </Accordion>
  )
}
