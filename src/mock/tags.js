import faker from "faker"
import { capitalize } from "../utils/functions/common"

faker.locale = "es"

export const generateRandomTag = () => ({
  updatedAt: faker.date.past(),
  name: capitalize(faker.lorem.words(1)),
  projects: new Array(faker.datatype.number(10))
    .fill("")
    .map((_) => `${faker.name.firstName()} ${faker.name.lastName()}`),
  relatedTags: new Array(faker.datatype.number(10))
    .fill("")
    .map(() => faker.lorem.word(10)),
})

export const PROJECT_TAGS_MOCK = new Array(20).fill("").map(generateRandomTag)
