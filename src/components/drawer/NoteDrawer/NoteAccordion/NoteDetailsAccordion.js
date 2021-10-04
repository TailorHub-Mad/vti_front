import { Accordion, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import { PATHS } from "../../../../utils/constants/global"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { downloadFile } from "../../../../utils/functions/files"
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
import {chakra} from "@chakra-ui/react"
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
  const router = useRouter()
  const { downloadDocument, downloadMessageDocument } = useNoteApi()

  const handleOnClick = async (id, name) => {
    const response = isMessage
      ? await downloadMessageDocument(id)
      : await downloadDocument(id)
    downloadFile(response, name)
  }

  return (
    <Accordion allowToggle allowMultiple {...props}>
      {!isMessage && testSystems ? (
        <NoteAccordionItem
          title="Sistema de ensayo del proyecto"
          icon={<TestSystemLineIcon mr="8px" />}
        >
          {testSystems.map((ts, idx) => (
            <Button
              key={`${ts}-${idx}`}
              variant="note_content"
              mr="8px"
              mb="8px"
              onClick={() => router.push(`${PATHS.testSystems}/${ts._id}`)}
            >
              {ts.alias}
            </Button>
          ))}
        </NoteAccordionItem>
      ) : null}

      {!isMessage && noteTags ? (
        <NoteAccordionItem title="Tags de apunte" icon={<TagLineIcon mr="8px" />}>
          <TagRow
            tags={formatTags(noteTags, "name")}
            variant={variantGeneralTag.NOTE}
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
          {message.split("\n").map((ms) => (
            <chakra.p key={ms} display="block">
              {ms}
            </chakra.p>
          ))}
        </NoteAccordionItem>
      ) : null}

      {link ? (
        <NoteAccordionItem title="Link" icon={<LinkLineIcon mr="8px" />}>
          <Button
            variant="note_content"
            mr="8px"
            mb="8px"
            onClick={() => window.open(link)}
          >
            <LinkLineIcon width="16px" />
            {link}
          </Button>
        </NoteAccordionItem>
      ) : null}

      {files ? (
        <NoteAccordionItem title="Adjuntos" icon={<CloudLineIcon mr="8px" />}>
          {files.map((file, idx) => {
            const name = file.url?.split("-")[1]

            return (
              <Button
                key={`${file.name}-${idx}`}
                variant="note_content"
                mr="8px"
                mb="8px"
                onClick={() => handleOnClick(file._id, name)}
              >
                {file.type === "image" ? <ImageTypeIcon /> : <PdfTypeIcon />}
                {name}
              </Button>
            )
          })}
        </NoteAccordionItem>
      ) : null}
    </Accordion>
  )
}
