import faker from "faker"
import { capitalize } from "../utils/functions/common"

faker.locale = "es"

const generateRandomTag = () => {
  const hasParent = faker.datatype.boolean()
  return {
    updatedAt: faker.date.past(),
    category: faker.random.arrayElement(["Fruta", "Verdura"]),
    name: capitalize(faker.lorem.words(1)),
    projects: new Array(faker.datatype.number(10))
      .fill("")
      .map((_) => `${faker.name.firstName()} ${faker.name.lastName()}`),
    relatedTags: hasParent
      ? new Array(faker.datatype.number(10)).fill("").map(() => faker.lorem.word(10))
      : [],
    parentTag: hasParent ? faker.lorem.word(10) : null,
  }
}
export const PROJECT_TAGS_MOCK = new Array(20).fill("").map(generateRandomTag)
