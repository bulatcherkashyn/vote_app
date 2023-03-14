import { Language } from '../../../../src/iviche/common/Language'
import { ArticleTitleDefinition } from '../ArticleTitleDefinition'

type AnswersLangPrases = {
  [lang in Language]: Array<string>
}
type AnswersDefinition = {
  answers2: AnswersLangPrases
  lastnames2: AnswersLangPrases
  answers3: AnswersLangPrases
  lastnames4: AnswersLangPrases
  answers5: AnswersLangPrases
  lastnames6: AnswersLangPrases
  lastnames11: AnswersLangPrases
}

export const readyAnswers: AnswersDefinition = {
  answers2: {
    [Language.UA]: ['Згоден', 'Не згоден'],
    [Language.RU]: ['Согласен', 'Не согласен'],
    [Language.EN]: [],
  },
  lastnames2: {
    [Language.UA]: ['Авраменко', 'Бомко'],
    [Language.RU]: ['Акасян', 'Борисов'],
    [Language.EN]: [],
  },
  answers3: {
    [Language.UA]: ['Підтримую', 'Не цікавлюсь', 'Проти'],
    [Language.RU]: ['Поддерживаю', 'Не интересуюсь', 'Против'],
    [Language.EN]: [],
  },
  lastnames4: {
    [Language.UA]: ['Коваленко', 'Иваненко', 'Манько', 'Тополько'],
    [Language.RU]: ['Алаев', 'Иванов', 'Малышев', 'Петров'],
    [Language.EN]: [],
  },
  answers5: {
    [Language.UA]: [
      'Палко підтримую',
      'Скоріше підтримую',
      'Не цікавлюсь',
      'Скоріше проти',
      'Абсолютно проти',
    ],
    [Language.RU]: [
      'Точно поддерживаю',
      'Скорее поддерживаю',
      'Не интересуюсь',
      'Скорее против',
      'Абсолютно против',
    ],
    [Language.EN]: [],
  },
  lastnames6: {
    [Language.UA]: ['Спасенко', 'Котофейко', 'Зеленько', 'Тополько', 'Списаренко', 'Васющенко'],
    [Language.RU]: ['Андропов', 'Кивалов', 'Азиров', 'Титов', 'Оводов', 'Сидоров'],
    [Language.EN]: [],
  },
  lastnames11: {
    [Language.UA]: [
      'Авраменко',
      'Бортко',
      'Василенко',
      'Грищенко',
      'Дорошенко',
      'Иваненко',
      'Коломиенко',
      'Манько',
      'Ниженко',
      'Онищенко',
      'Павленко',
    ],
    [Language.RU]: [
      'Алаев',
      'Бортников',
      'Васильев',
      'Грицак',
      'Дорошев',
      'Иванов',
      'Коломойский',
      'Манов',
      'Ниженский',
      'Осотов',
      'Павлов',
    ],
    [Language.EN]: [],
  },
}

export const ukrainianThemes: Array<ArticleTitleDefinition> = [
  {
    RU: 'Необходимо повысить пенсии за счет повышения налогов',
    UA: 'Потрібно підвищити пенсії за рахунок підвищення податків',
  },
  {
    RU: 'Необходимо упразднить ФЛП для повышения сбора налогов',
    UA: 'Потрібно скасувати ФОП для підвищення збору податків',
  },
  {
    RU: 'Необходимо упразднить субсидии для сохранения денег в бюджете',
    UA: 'Потрібно скасувати субсидії для збереження коштів в бюджеті',
  },
  {
    RU:
      'Необходимо повисить помощь многодетним семьям за счет снижения расходов на содержение чиновников',
    UA:
      "Потрібно підвищити допомогу багатодітним сім'ям за рахунок зниження видатків на утримання чиновників",
  },
  {
    RU:
      'Необходимо повисить помощь матерям одиночкам за счет снижения расходов на содержение чиновников',
    UA:
      'Потрібно підвищити допомогу одиноким матерям за рахунок зниження видатків на утримання чиновників',
  },
  {
    RU: 'Необходимо вкладивать средства в развитие армии за счет снижения расходов МВД',
    UA: 'Потрібно інвестувати кошти у розвиток армії за рахунок зниженя видатків МВС',
  },
  {
    RU:
      'Необходимо вкладивать средства в развитие систем ракетной обороны за счет снижения расходов МВД',
    UA:
      'Потрібно інвестувати кошти у розвиток систем ракетної оборони за рахунок зниженя видатків МВС',
  },
  {
    RU: 'Необходимо строить морской москитный флот за счет снижения расходов МВД',
    UA: 'Потрібно будувати морський москітний флот за рахунок зниженя видатків МВС',
  },
  {
    RU: 'Необходимо закупить в США системы РЭБ',
    UA: 'Потрібно купити в США системи РЕБ',
  },
  {
    RU: 'Необходимо виделить средства на постройку системы защищенной военной связи',
    UA: "Потрібно інвестувати кошти у будівництво системи захищенного війського зв'язку",
  },
  {
    RU: 'Необходимо снизить налоги для стимулирования роста экономики',
    UA: 'Потрібно знизити податки для стимулування росту економіки',
  },
  {
    RU: 'Необходимо дать молодому бизнесу налоговые каникулы для стимулирования роста экономики',
    UA: 'Потрібно дати молодому бізнесу податкові канікули для стимулування росту економіки',
  },
  {
    RU: 'Необходимо сделать в Украине оффшорную безналоговую зону',
    UA: 'Потрібно зробити в Україні оффшорну безподаткову зону',
  },
  {
    RU: 'Необходимо провести переатестацию судей',
    UA: 'Потрібно провести переатестацію судей',
  },
  {
    RU: 'Необходимо провести переатестацию прокуроров',
    UA: 'Потрібно провести переатестацію прокурорів',
  },
  {
    RU: 'Необходимо провести повторную переатестацию полиции',
    UA: 'Потрібно провести повторну переатестацію поліції',
  },
  {
    RU: 'Необходимо закрепить раздельний сбор мусора на законодательном уровне',
    UA: 'Потрібно закріпити розільний збір сміття на законодавчому рівні',
  },
  {
    RU: 'Необходимо закрепить запрет на использование пластика и переход на изделия из бумаги',
    UA: 'Потрібно закріпити заборону на використання пластику та перехід на вироби з паперу',
  },
  {
    RU: 'Необходимо ввести субсидии на покупку электротранспорта',
    UA: 'Потрібно ввести субсидії на придбання електротранспорту',
  },
  {
    RU: 'Необходимо вернуть зеление тарифи на электроэнергию',
    UA: 'Потрібно повернути зелені тарифи на електроенергію',
  },
  {
    RU: 'Необходимо принять участие в программе освоения Луны',
    UA: 'Потрібно прийняти участь у программі освоєння Місяця',
  },
  {
    RU: 'Необходимо принять участие в программе бурения астероидов',
    UA: 'Потрібно прийняти участь у программі буріння астероїдів',
  },
]

export const regionalThemes: Array<ArticleTitleDefinition> = [
  {
    RU: 'Закрить угольную генерацию тепла и электричества для улучшения экологической ситуации',
    UA: 'Закрити вугільну генерацію тепла та електренергії для покращення екологічного стану',
  },
  {
    RU: 'Построить мусороперерабативающий завод',
    UA: 'Побудувати сміттєпереробний завод',
  },
  {
    RU: 'Построить новую больницу',
    UA: 'Побудувати нову лікарню',
  },
  {
    RU: 'Построить ветровую электростанцию',
    UA: 'Побудувати вітрову електростанцію',
  },
  {
    RU: 'Виделить средства на обеспечение субсидий для владельцев солнечних электростанций',
    UA: 'Виділити кошти на забезпечення субсидій для власників сонячних електростанцій',
  },
  {
    RU: 'Виделить средства на восстановление лесных массивов',
    UA: 'Виділити кошти на відновлення лісових масивів',
  },
  {
    RU: 'Виделить средства на развитие медецины в малих населенных пунктах',
    UA: 'Виділити кошти на розвиток медецини у малих населенних пунктах',
  },
]

export const districtThemes: Array<ArticleTitleDefinition> = [
  {
    RU: 'Кто станет следующим мэром города',
    UA: 'Хто стане наступним мером міста',
  },
  {
    RU: 'Поддерживаете ли вы идею установления местного налога для развития инфраструктуры района',
    UA: 'Чи підтримуєте ви ідею встановлення місцевого податку для розвитку інфраструктури району',
  },
]