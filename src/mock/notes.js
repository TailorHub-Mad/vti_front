import faker from "faker"

faker.locale = "es"

export const generateRandomNote = () => ({
  updatedAt: faker.date.past(),
  id: `${faker.lorem.word(3).toUpperCase()}-00${faker.lorem.word(5).toUpperCase()}`,
  author: `${faker.name.firstName()} ${faker.name.lastName()}`,
  title: faker.lorem.words(6),
  isFavorite: faker.datatype.boolean(),
  isClosed: faker.datatype.boolean(),
  canSubscribe: faker.datatype.boolean(),
  subscribedUsers: new Array(faker.datatype.number(10))
    .fill("")
    .map(() => `${faker.name.firstName()} ${faker.name.lastName()}`),
  tags: {
    project_tags: new Array(faker.datatype.number(10))
      .fill("")
      .map(() => faker.lorem.word()),
    test_system_tags: new Array(faker.datatype.number(10))
      .fill("")
      .map(() => faker.lorem.word()),
    notes_tags: new Array(faker.datatype.number(10))
      .fill("")
      .map(() => faker.lorem.word(10))
  }
})

export const NOTES_MOCK = new Array(100).fill("").map(generateRandomNote)
