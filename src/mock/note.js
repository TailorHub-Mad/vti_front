import { capitalize } from "../utils/functions/common"
import faker from "faker"
faker.locale = "es"

export const NOTE_MOCK = {
  project: `${capitalize(faker.lorem.word())} ${faker.lorem.words(4)}`,
  title: `${capitalize(faker.lorem.word())} ${faker.lorem.words(4)}`,
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  updatedAt: faker.date.past(),
  note_tags: new Array(faker.datatype.number(10))
    .fill("")
    .map(() => faker.lorem.word()),
  test_systems: new Array(faker.datatype.number(4))
    .fill("")
    .map(() => faker.lorem.word()),
  links: new Array(faker.datatype.number(10))
    .fill("")
    .map(() => `www.${faker.lorem.word()}.com`),
  message: faker.lorem.words(80),
  files: new Array(faker.datatype.number(10)).fill("").map(() => ({
    type: faker.datatype.boolean() ? "image" : "pdf",
    name: `${faker.lorem.word()}.pdf`,
  })),
}
