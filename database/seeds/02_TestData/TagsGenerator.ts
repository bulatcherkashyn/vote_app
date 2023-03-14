import { List } from 'immutable'

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateTags(): List<string> {
  const exampleTags = ['Політика', 'Вибори', 'xxx']
  const tagsCount = getRandomIntInclusive(1, 3)
  const resultTags: Array<string> = []
  for (let i = 0; i < tagsCount; i++) {
    let uniq = exampleTags[getRandomIntInclusive(0, exampleTags.length - 1)]
    while (resultTags.includes(uniq)) {
      uniq = exampleTags[getRandomIntInclusive(0, exampleTags.length - 1)]
    }
    resultTags.push(uniq)
  }
  return List(resultTags)
}