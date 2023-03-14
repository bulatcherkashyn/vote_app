type Langs = {
  UA: string
  EN: string
  RU: string
}

export enum CityType {
  REGIONAL_CITY = 'REGIONAL_CITY',
  DISTRICT_CITY = 'DISTRICT_CITY',
  DISTRICT_TOWN = 'DISTRICT_TOWN',
  SYMLINK = 'SYMLINK',
}

type District = {
  key: string
  title: Langs
}

export type City = {
  key: string
  title: Langs
  centerOf?: string
  centerOf2?: string
  type: CityType
}

export type RegionsAndDistricts = {
  key: string
  title: Langs
  districts: Array<District>
  cities: Array<City>
}

export const regionsAndDistricts: Array<RegionsAndDistricts> = [
  {
    key: 'KRYM_REGION',
    title: {
      UA: 'Автономна Республіка Крим',
      EN: 'Autonomous Republic of Crimea',
      RU: 'Автономная Республика Крым',
    },
    districts: [
      {
        key: 'bakhchysaraiskyi_district',
        title: { UA: 'Бахчисарайський', EN: 'Bakhchysaraiskyi', RU: 'Бахчисарайский' },
      },
      {
        key: 'bilohirskyi_district',
        title: { UA: 'Білогірський', EN: 'Bilohirskyi', RU: 'Белогорский' },
      },
      {
        key: 'dzhankoiskyi_district',
        title: { UA: 'Джанкойський', EN: 'Dzhankoiskyi', RU: 'Джанкойский' },
      },
      { key: 'kirovskyi_district', title: { UA: 'Кіровський', EN: 'Kirovskyi', RU: 'Кировский' } },
      {
        key: 'krasnohvardiiskyi_district',
        title: { UA: 'Красногвардійський', EN: 'Krasnohvardiiskyi', RU: 'Красногвардейский' },
      },
      {
        key: 'krasnoperekopskyi_district',
        title: { UA: 'Красноперекопський', EN: 'Krasnoperekopskyi', RU: 'Красноперекопский' },
      },
      { key: 'leninskyi_district', title: { UA: 'Ленінський', EN: 'Leninskyi', RU: 'Ленинский' } },
      {
        key: 'nyzhnohirskyi_district',
        title: { UA: 'Нижньогірський', EN: 'Nyzhnohirskyi', RU: 'Нижнегорский' },
      },
      {
        key: 'pervomaiskyi_district',
        title: { UA: 'Первомайський', EN: 'Pervomaiskyi', RU: 'Первомайский' },
      },
      {
        key: 'rozdolnenskyi_district',
        title: { UA: 'Роздольненський', EN: 'Rozdolnenskyi', RU: 'Раздольненский' },
      },
      { key: 'sakskyi_district', title: { UA: 'Сакський', EN: 'Sakskyi', RU: 'Сакский' } },
      {
        key: 'simferopolskyi_district',
        title: { UA: 'Сімферопольський', EN: 'Simferopolskyi', RU: 'Симферопольский' },
      },
      {
        key: 'sovietskyi_district',
        title: { UA: 'Совєтський', EN: 'Sovietskyi', RU: 'Советский' },
      },
      {
        key: 'chornomorskyi_district',
        title: { UA: 'Чорноморський', EN: 'Chornomorskyi', RU: 'Черноморский' },
      },
    ],
    cities: [
      {
        key: 'alushta_city',
        title: { UA: 'Алушта', EN: 'Alushta', RU: 'Алушта' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'armiansk_city',
        title: { UA: 'Армянськ', EN: 'Armiansk', RU: 'Армянск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bakhchysarai_city',
        title: { UA: 'Бахчисарай', EN: 'Bakhchysarai', RU: 'Бахчисарай' },
        centerOf: 'bakhchysaraiskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bilohirsk_city',
        title: { UA: 'Білогірськ', EN: 'Bilohirsk', RU: 'Белогорск' },
        centerOf: 'bilohirskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'dzhankoi_city',
        title: { UA: 'Джанкой', EN: 'Dzhankoi', RU: 'Джанкой' },
        centerOf: 'dzhankoiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yevpatoriia_city',
        title: { UA: 'Євпаторія', EN: 'Yevpatoriia', RU: 'Евпатория' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kerch_city',
        title: { UA: 'Керч', EN: 'Kerch', RU: 'Керчь' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kirovske_town',
        title: { UA: 'Кіровське', EN: 'Kirovske', RU: 'Кировское' },
        centerOf: 'kirovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'krasnohvardiiske_town',
        title: { UA: 'Красногвардійське', EN: 'Krasnohvardiiske', RU: 'Красногвардейское' },
        centerOf: 'krasnohvardiiskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'krasnoperekopsk_city',
        title: { UA: 'Красноперекопськ', EN: 'Krasnoperekopsk', RU: 'Красноперекопск' },
        centerOf: 'krasnoperekopskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lenine_town',
        title: { UA: 'Леніне', EN: 'Lenine', RU: 'Ленино' },
        centerOf: 'leninskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'rozdolne_town',
        title: { UA: 'Роздольне', EN: 'Rozdolne', RU: 'Раздольное' },
        centerOf: 'rozdolnenskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'nyzhnohirskyi_town',
        title: { UA: 'Нижньогірський', EN: 'Nyzhnohirskyi', RU: 'Нижнегорский' },
        centerOf: 'nyzhnohirskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pervomaiske_town',
        title: { UA: 'Первомайське', EN: 'Pervomaiske', RU: 'Первомайск' },
        centerOf: 'pervomaiskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'saky_city',
        title: { UA: 'Саки', EN: 'Saky', RU: 'Саки' },
        centerOf: 'sakskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'simferopol_city',
        title: { UA: 'Сімферополь', EN: 'Simferopol', RU: 'Симферополь' },
        centerOf: 'simferopolskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'sovietskyi_town',
        title: { UA: 'Совєтський', EN: 'Sovietskyi', RU: 'Советский' },
        centerOf: 'sovietskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sudak_city',
        title: { UA: 'Судак', EN: 'Sudak', RU: 'Судак' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'feodosiia_city',
        title: { UA: 'Феодосія', EN: 'Feodosiia', RU: 'Феодосия' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chornomorske_town',
        title: { UA: 'Чорноморське', EN: 'Chornomorske', RU: 'Черноморское' },
        centerOf: 'chornomorskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yalta_city',
        title: { UA: 'Ялта', EN: 'Yalta', RU: 'Ялта' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'VINNYTSIA_REGION',
    title: { UA: 'Вінницька', EN: 'Vinnytsia', RU: 'Винницкая' },
    districts: [
      { key: 'barskyi_district', title: { UA: 'Барський', EN: 'Barskyi', RU: 'Барский' } },
      {
        key: 'bershadskyi_district',
        title: { UA: 'Бершадський', EN: 'Bershadskyi', RU: 'Бершадский' },
      },
      {
        key: 'vinnytskyi_district',
        title: { UA: 'Вінницький', EN: 'Vinnytskyi', RU: 'Винницкий' },
      },
      {
        key: 'haisynskyi_district',
        title: { UA: 'Гайсинський', EN: 'Haisynskyi', RU: 'Гайсинский' },
      },
      {
        key: 'zhmerynskyi_district',
        title: { UA: 'Жмеринський', EN: 'Zhmerynskyi', RU: 'Жмеринский' },
      },
      {
        key: 'illinetskyi_district',
        title: { UA: 'Іллінецький', EN: 'Illinetskyi', RU: 'Ильинецкий' },
      },
      {
        key: 'kalynivskyi_district',
        title: { UA: 'Калинівський', EN: 'Kalynivskyi', RU: 'Калиновский' },
      },
      {
        key: 'koziatynskyi_district',
        title: { UA: 'Козятинський', EN: 'Koziatynskyi', RU: 'Казатинский' },
      },
      {
        key: 'kryzhopilskyi_district',
        title: { UA: 'Крижопільський', EN: 'Kryzhopilskyi', RU: 'Крыжопольский' },
      },
      {
        key: 'lypovetskyi_district',
        title: { UA: 'Липовецький', EN: 'Lypovetskyi', RU: 'Липовецкий' },
      },
      { key: 'litynskyi_district', title: { UA: 'Літинський', EN: 'Litynskyi', RU: 'Литинский' } },
      {
        key: 'mohyliv_podilskyi_district',
        title: { UA: 'Могилів-Подільський', EN: 'Mohyliv-Podilskyi', RU: 'Могилёв-Подольский' },
      },
      {
        key: 'murovanokurylovetskyi_district',
        title: {
          UA: 'Мурованокуриловецький',
          EN: 'Murovanokurylovetskyi',
          RU: 'Мурованокуриловецкий',
        },
      },
      {
        key: 'nemyrivskyi_district',
        title: { UA: 'Немирівський', EN: 'Nemyrivskyi', RU: 'Немировский' },
      },
      {
        key: 'orativskyi_district',
        title: { UA: 'Оратівський', EN: 'Orativskyi', RU: 'Оратовский' },
      },
      {
        key: 'pishchanskyi_district',
        title: { UA: 'Піщанський', EN: 'Pishchanskyi', RU: 'Песчанский' },
      },
      {
        key: 'pohrebyshchenskyi_district',
        title: { UA: 'Погребищенський', EN: 'Pohrebyshchenskyi', RU: 'Погребищенский' },
      },
      {
        key: 'teplytskyi_district',
        title: { UA: 'Теплицький', EN: 'Teplytskyi', RU: 'Тепликский' },
      },
      {
        key: 'tyvrivskyi_district',
        title: { UA: 'Тиврівський', EN: 'Tyvrivskyi', RU: 'Тывровский' },
      },
      {
        key: 'tomashpilskyi_district',
        title: { UA: 'Томашпільський', EN: 'Tomashpilskyi', RU: 'Томашпольский' },
      },
      {
        key: 'trostianetskyi_district',
        title: { UA: 'Тростянецький', EN: 'Trostianetskyi', RU: 'Тростянецкий' },
      },
      {
        key: 'tulchynskyi_district',
        title: { UA: 'Тульчинський', EN: 'Tulchynskyi', RU: 'Тульчинский' },
      },
      {
        key: 'khmilnytskyi_district',
        title: { UA: 'Хмільницький', EN: 'Khmilnytskyi', RU: 'Хмельницкий' },
      },
      {
        key: 'chernivetskyi_district',
        title: { UA: 'Чернівецький', EN: 'Chernivetskyi', RU: 'Черневецкий' },
      },
      {
        key: 'chechelnytskyi_district',
        title: { UA: 'Чечельницький', EN: 'Chechelnytskyi', RU: 'Чечельницкий' },
      },
      {
        key: 'sharhorodskyi_district',
        title: { UA: 'Шаргородський', EN: 'Sharhorodskyi', RU: 'Шаргородский' },
      },
      {
        key: 'yampilskyi_district',
        title: { UA: 'Ямпільський', EN: 'Yampilskyi', RU: 'Ямпольский' },
      },
    ],
    cities: [
      {
        key: 'bar_city',
        title: { UA: 'Бар', EN: 'Bar', RU: 'Бар' },
        centerOf: 'barskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bershad_city',
        title: { UA: 'Бершадь', EN: 'Bershad', RU: 'Бершадь' },
        centerOf: 'bershadskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'vinnytsia_city',
        title: { UA: 'Вінниця', EN: 'Vinnytsia', RU: 'Винница' },
        centerOf: 'vinnytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'haisyn_city',
        title: { UA: 'Гайсин', EN: 'Haisyn', RU: 'Гайсин' },
        centerOf: 'haisynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zhmerynka_city',
        title: { UA: 'Жмеринка', EN: 'Zhmerynka', RU: 'Жмеринка' },
        centerOf: 'zhmerynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'illintsi_city',
        title: { UA: 'Іллінці', EN: 'Illintsi', RU: 'Ильинцы' },
        centerOf: 'illinetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kalynivka_city',
        title: { UA: 'Калинівка', EN: 'Kalynivka', RU: 'Калиновка' },
        centerOf: 'kalynivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'koziatyn_city',
        title: { UA: 'Козятин', EN: 'Koziatyn', RU: 'Казатин' },
        centerOf: 'koziatynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kryzhopil_town',
        title: { UA: 'Крижопіль', EN: 'Kryzhopil', RU: 'Крыжополь' },
        centerOf: 'kryzhopilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ladyzhyn_city',
        title: { UA: 'Ладижин', EN: 'Ladyzhyn', RU: 'Ладыжин' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lypovets_city',
        title: { UA: 'Липовець', EN: 'Lypovets', RU: 'Липовец' },
        centerOf: 'lypovetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lityn_town',
        title: { UA: 'Літин', EN: 'Lityn', RU: 'Литин' },
        centerOf: 'litynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mohyliv_podilskyi_city',
        title: { UA: 'Могилів-Подільський', EN: 'Mohyliv-Podilskyi', RU: 'Могилёв-Подольский' },
        centerOf: 'mohyliv_podilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'murovani_kurylivtsi_town',
        title: { UA: 'Муровані Курилівці', EN: 'Murovani Kurylivtsi', RU: 'Мурованые Куриловцы' },
        centerOf: 'murovanokurylovetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'nemyriv_city',
        title: { UA: 'Немирів', EN: 'Nemyriv', RU: 'Немиров' },
        centerOf: 'nemyrivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'orativ_town',
        title: { UA: 'Оратів', EN: 'Orativ', RU: 'Оратов' },
        centerOf: 'orativskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pishchanka_town',
        title: { UA: 'Піщанка', EN: 'Pishchanka', RU: 'Песчанка' },
        centerOf: 'pishchanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pohrebyshche_city',
        title: { UA: 'Погребище', EN: 'Pohrebyshche', RU: 'Погребище' },
        centerOf: 'pohrebyshchenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'teplyk_town',
        title: { UA: 'Теплик', EN: 'Teplyk', RU: 'Теплик' },
        centerOf: 'teplytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tyvriv_town',
        title: { UA: 'Тиврів', EN: 'Tyvriv', RU: 'Тывров' },
        centerOf: 'tyvrivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tomashpil_town',
        title: { UA: 'Томашпіль', EN: 'Tomashpil', RU: 'Томашполь' },
        centerOf: 'tomashpilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'trostianets_town',
        title: { UA: 'Тростянец', EN: 'Trostianets', RU: 'Тростянец' },
        centerOf: 'trostianetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tulchyn_city',
        title: { UA: 'Тульчин', EN: 'Tulchyn', RU: 'Тульчин' },
        centerOf: 'tulchynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'khmilnyk_city',
        title: { UA: 'Хмільник', EN: 'Khmilnyk', RU: 'Хмельник' },
        centerOf: 'khmilnytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chernivtsi_town',
        title: { UA: 'Чернівці', EN: 'Chernivtsi', RU: 'Черновцы' },
        centerOf: 'chernivetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'chechelnyk_town',
        title: { UA: 'Чечельник', EN: 'Chechelnyk', RU: 'Чечельник' },
        centerOf: 'chechelnytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sharhorod_city',
        title: { UA: 'Шаргород', EN: 'Sharhorod', RU: 'Шаргород' },
        centerOf: 'sharhorodskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'yampil_city',
        title: { UA: 'Ямпіль', EN: 'Yampil', RU: 'Ямполь' },
        centerOf: 'yampilskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'VOLYN_REGION',
    title: { UA: 'Волинська', EN: 'Volyn', RU: 'Волынская' },
    districts: [
      {
        key: 'volodymyr_volynskyi_district',
        title: { UA: 'Володимир-Волинський', EN: 'Volodymyr-Volynskyi', RU: 'Владимир-Волынский' },
      },
      {
        key: 'horokhivskyi_district',
        title: { UA: 'Горохівський', EN: 'Horokhivskyi', RU: 'Гороховский' },
      },
      {
        key: 'ivanychivskyi_district',
        title: { UA: 'Іваничівський', EN: 'Ivanychivskyi', RU: 'Иваничевский' },
      },
      {
        key: 'kamin_kashyrskyi_district',
        title: { UA: 'Камінь-Каширський', EN: 'Kamin-Kashyrskyi', RU: 'Камень-Каширский' },
      },
      {
        key: 'kivertsivskyi_district',
        title: { UA: 'Ківерцівський', EN: 'Kivertsivskyi', RU: 'Киверцовский' },
      },
      {
        key: 'kovelskyi_district',
        title: { UA: 'Ковельський', EN: 'Kovelskyi', RU: 'Ковельский' },
      },
      {
        key: 'lokachynskyi_district',
        title: { UA: 'Локачинський', EN: 'Lokachynskyi', RU: 'Локачинский' },
      },
      { key: 'lutskyi_district', title: { UA: 'Луцький', EN: 'Lutskyi', RU: 'Луцкий' } },
      {
        key: 'liubeshivskyi_district',
        title: { UA: 'Любешівський', EN: 'Liubeshivskyi', RU: 'Любешовский' },
      },
      {
        key: 'liubomlskyi_district',
        title: { UA: 'Любомльський', EN: 'Liubomlskyi', RU: 'Любомльский' },
      },
      {
        key: 'manevytskyi_district',
        title: { UA: 'Маневицький', EN: 'Manevytskyi', RU: 'Маневичский' },
      },
      {
        key: 'ratnivskyi_district',
        title: { UA: 'Ратнівський', EN: 'Ratnivskyi', RU: 'Ратновский' },
      },
      {
        key: 'rozhyshchenskyi_district',
        title: { UA: 'Рожищенський', EN: 'Rozhyshchenskyi', RU: 'Рожищенский' },
      },
      {
        key: 'starovyzhivskyi_district',
        title: { UA: 'Старовижівський', EN: 'Starovyzhivskyi', RU: 'Старовыжевский' },
      },
      { key: 'turiiskyi_district', title: { UA: 'Турійський', EN: 'Turiiskyi', RU: 'Турийский' } },
      { key: 'shatskyi_district', title: { UA: 'Шацький', EN: 'Shatskyi', RU: 'Шацкий' } },
    ],
    cities: [
      {
        key: 'volodymyr_volynskyi_city',
        title: { UA: 'Володимир-Волинський', EN: 'Volodymyr-Volynskyi', RU: 'Владимир-Волынский' },
        centerOf: 'volodymyr_volynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'horokhiv_city',
        title: { UA: 'Горохів', EN: 'Horokhiv', RU: 'Горохов' },
        centerOf: 'horokhivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'ivanychi_town',
        title: { UA: 'Іваничі', EN: 'Ivanychi', RU: 'Иваничи' },
        centerOf: 'ivanychivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kamin_kashyrskyi_city',
        title: { UA: 'Камінь-Каширський', EN: 'Kamin-Kashyrskyi', RU: 'Камень-Каширский' },
        centerOf: 'kamin_kashyrskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kivertsi_city',
        title: { UA: 'Ківерці', EN: 'Kivertsi', RU: 'Киверцы' },
        centerOf: 'kivertsivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kovel_city',
        title: { UA: 'Ковель', EN: 'Kovel', RU: 'Ковель' },
        centerOf: 'kovelskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lokachi_town',
        title: { UA: 'Локачі', EN: 'Lokachi', RU: 'Локачи' },
        centerOf: 'lokachynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'lutsk_city',
        title: { UA: 'Луцьк', EN: 'Lutsk', RU: 'Луцк' },
        centerOf: 'lutskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'liubeshiv_town',
        title: { UA: 'Любешів', EN: 'Liubeshiv', RU: 'Любешов' },
        centerOf: 'liubeshivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'liuboml_city',
        title: { UA: 'Любомль', EN: 'Liuboml', RU: 'Любомль' },
        centerOf: 'liubomlskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'manevychi_town',
        title: { UA: 'Маневичі', EN: 'Manevychi', RU: 'Маневичи' },
        centerOf: 'manevytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novovolynsk_city',
        title: { UA: 'Нововолинськ', EN: 'Novovolynsk', RU: 'Нововолынск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'ratne_town',
        title: { UA: 'Ратне', EN: 'Ratne', RU: 'Ратно' },
        centerOf: 'ratnivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'rozhyshche_city',
        title: { UA: 'Рожище', EN: 'Rozhyshche', RU: 'Рожище' },
        centerOf: 'rozhyshchenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'stara_vyzhivka_town',
        title: { UA: 'Стара Вижівка', EN: 'Stara Vyzhivka', RU: 'Старая Выжевка' },
        centerOf: 'starovyzhivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'turiisk_town',
        title: { UA: 'Турійськ', EN: 'Turiisk', RU: 'Турийск' },
        centerOf: 'turiiskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'shatsk_town',
        title: { UA: 'Шацьк', EN: 'Shatsk', RU: 'Шацк' },
        centerOf: 'shatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'DNIPROPETROVSK_REGION',
    title: { UA: 'Дніпропетровська', EN: 'Dnipropetrovsk', RU: 'Днепропетровская' },
    districts: [
      {
        key: 'apostolivskyi_district',
        title: { UA: 'Апостолівський', EN: 'Apostolivskyi', RU: 'Апостоловский' },
      },
      {
        key: 'vasylkivskyi_district',
        title: { UA: 'Васильківський', EN: 'Vasylkivskyi', RU: 'Васильковский' },
      },
      {
        key: 'verkhnodniprovskyi_district',
        title: { UA: 'Верхньодніпровський', EN: 'Verkhnodniprovskyi', RU: 'Верхнеднепровский' },
      },
      {
        key: 'dniprovskyi_district',
        title: { UA: 'Дніпровський', EN: 'Dniprovskyi', RU: 'Днепровский' },
      },
      {
        key: 'kryvorizkyi_district',
        title: { UA: 'Криворізький', EN: 'Kryvorizkyi', RU: 'Криворожский' },
      },
      {
        key: 'krynychanskyi_district',
        title: { UA: 'Криничанський', EN: 'Krynychanskyi', RU: 'Криничанский' },
      },
      {
        key: 'mahdalynivskyi_district',
        title: { UA: 'Магдалинівський', EN: 'Mahdalynivskyi', RU: 'Магдалиновский' },
      },
      {
        key: 'mezhivskyi_district',
        title: { UA: 'Межівський', EN: 'Mezhivskyi', RU: 'Межевский' },
      },
      {
        key: 'nikopolskyi_district',
        title: { UA: 'Нікопольський', EN: 'Nikopolskyi', RU: 'Никопольский' },
      },
      {
        key: 'novomoskovskyi_district',
        title: { UA: 'Новомосковський', EN: 'Novomoskovskyi', RU: 'Новомосковский' },
      },
      {
        key: 'piatykhatskyi_district',
        title: { UA: "П'ятихатський", EN: 'Piatykhatskyi', RU: 'Пятихатский' },
      },
      {
        key: 'pavlohradskyi_district',
        title: { UA: 'Павлоградський', EN: 'Pavlohradskyi', RU: 'Павлоградский' },
      },
      {
        key: 'petrykivskyi_district',
        title: { UA: 'Петриківський', EN: 'Petrykivskyi', RU: 'Петриковский' },
      },
      {
        key: 'petropavlivskyi_district',
        title: { UA: 'Петропавлівський', EN: 'Petropavlivskyi', RU: 'Петропавловский' },
      },
      {
        key: 'pokrovskyi_district',
        title: { UA: 'Покровський', EN: 'Pokrovskyi', RU: 'Покровский' },
      },
      {
        key: 'synelnykivskyi_district',
        title: { UA: 'Синельниківський', EN: 'Synelnykivskyi', RU: 'Синельниковский' },
      },
      {
        key: 'solonianskyi_district',
        title: { UA: 'Солонянський', EN: 'Solonianskyi', RU: 'Солонянский' },
      },
      {
        key: 'sofiivskyi_district',
        title: { UA: 'Софіївський', EN: 'Sofiivskyi', RU: 'Софиевский' },
      },
      {
        key: 'tomakivskyi_district',
        title: { UA: 'Томаківський', EN: 'Tomakivskyi', RU: 'Томаковский' },
      },
      {
        key: 'tsarychanskyi_district',
        title: { UA: 'Царичанський', EN: 'Tsarychanskyi', RU: 'Царичанский' },
      },
      {
        key: 'shyrokivskyi_district',
        title: { UA: 'Широківський', EN: 'Shyrokivskyi', RU: 'Широковский' },
      },
      { key: 'yurivskyi_district', title: { UA: "Юр'ївський", EN: 'Yurivskyi', RU: 'Юрьевский' } },
    ],
    cities: [
      {
        key: 'apostolove_city',
        title: { UA: 'Апостолове', EN: 'Apostolove', RU: 'Апостолово' },
        centerOf: 'apostolivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'vasylkivka_town',
        title: { UA: 'Васильківка', EN: 'Vasylkivka', RU: 'Васильковка' },
        centerOf: 'vasylkivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'verkhnodniprovsk_city',
        title: { UA: 'Верхньодніпровськ', EN: 'Verkhnodniprovsk', RU: 'Верхнеднепровск' },
        centerOf: 'verkhnodniprovskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'vilnohirsk_city',
        title: { UA: 'Вільногірськ', EN: 'Vilnohirsk', RU: 'Вольногорск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'dnipro_city',
        title: { UA: 'Дніпро', EN: 'Dnipro', RU: 'Днепр' },
        centerOf: 'dniprovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'zhovti_vody_city',
        title: { UA: 'Жовті Води', EN: 'Zhovti Vody', RU: 'Жёлтые Воды' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kamianske_city',
        title: { UA: "Кам'янське", EN: 'Kamianske', RU: 'Каменское' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kryvyi_rih_city',
        title: { UA: 'Кривий Ріг', EN: 'Kryvyi Rih', RU: 'Кривой Рог' },
        centerOf: 'kryvorizkyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'krynychky_town',
        title: { UA: 'Кринички', EN: 'Krynychky', RU: 'Кринички' },
        centerOf: 'krynychanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mahdalynivka_town',
        title: { UA: 'Магдалинівка', EN: 'Mahdalynivka', RU: 'Магдалиновка' },
        centerOf: 'mahdalynivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'marhanets_city',
        title: { UA: 'Марганець', EN: 'Marhanets', RU: 'Марганец' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mezhova_town',
        title: { UA: 'Межова', EN: 'Mezhova', RU: 'Межевая' },
        centerOf: 'mezhivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'nikopol_city',
        title: { UA: 'Нікополь', EN: 'Nikopol', RU: 'Никополь' },
        centerOf: 'nikopolskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'novomoskovsk_city',
        title: { UA: 'Новомосковськ', EN: 'Novomoskovsk', RU: 'Новомосковск' },
        centerOf: 'novomoskovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'piatykhatky_city',
        title: { UA: "П'ятихатки", EN: 'Piatykhatky', RU: 'Пятихатки' },
        centerOf: 'piatykhatskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'pavlohrad_city',
        title: { UA: 'Павлоград', EN: 'Pavlohrad', RU: 'Павлоград' },
        centerOf: 'pavlohradskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'pershotravensk_city',
        title: { UA: 'Першотравенськ', EN: 'Pershotravensk', RU: 'Першотравенск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'petrykivka_town',
        title: { UA: 'Петриківка', EN: 'Petrykivka', RU: 'Петриковка' },
        centerOf: 'petrykivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'petropavlivka_town',
        title: { UA: 'Петропавлівка', EN: 'Petropavlivka', RU: 'Петропавловка' },
        centerOf: 'petropavlivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pokrov_city',
        title: { UA: 'Покров', EN: 'Pokrov', RU: 'Покров' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'pokrovske_town',
        title: { UA: 'Покровське', EN: 'Pokrovske', RU: 'Покровское' },
        centerOf: 'pokrovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'synelnykove_city',
        title: { UA: 'Синельникове', EN: 'Synelnykove', RU: 'Синельниково' },
        centerOf: 'synelnykivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'solone_town',
        title: { UA: 'Солоне', EN: 'Solone', RU: 'Соленое' },
        centerOf: 'solonianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sofiivka_town',
        title: { UA: 'Софіївка', EN: 'Sofiivka', RU: 'Софиевка' },
        centerOf: 'sofiivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ternivka_city',
        title: { UA: 'Тернівка', EN: 'Ternivka', RU: 'Терновка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'tomakivka_town',
        title: { UA: 'Томаківка', EN: 'Tomakivka', RU: 'Томаковка' },
        centerOf: 'tomakivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tsarychanka_town',
        title: { UA: 'Царичанка', EN: 'Tsarychanka', RU: 'Царичанка' },
        centerOf: 'tsarychanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'shyroke_town',
        title: { UA: 'Широке', EN: 'Shyroke', RU: 'Широкое' },
        centerOf: 'shyrokivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yurivka_town',
        title: { UA: "Юр'ївка", EN: 'Yurivka', RU: 'Юрьевка' },
        centerOf: 'yurivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'DONETSK_REGION',
    title: { UA: 'Донецька', EN: 'Donetsk', RU: 'Донецкая' },
    districts: [
      {
        key: 'amvrosiivskyi_district',
        title: { UA: 'Амвросіївський', EN: 'Amvrosiivskyi', RU: 'Амвросиевский' },
      },
      {
        key: 'bakhmutskyi_district',
        title: { UA: 'Бахмутський', EN: 'Bakhmutskyi', RU: 'Бахмутский' },
      },
      {
        key: 'boikivskyi_district',
        title: { UA: 'Бойківський', EN: 'Boikivskyi', RU: 'Бойковский' },
      },
      {
        key: 'velykonovosilkivskyi_district',
        title: {
          UA: 'Великоновосілківський',
          EN: 'Velykonovosilkivskyi',
          RU: 'Великоновосёлковский',
        },
      },
      {
        key: 'volnovaskyi_district',
        title: { UA: 'Волноваський', EN: 'Volnovaskyi', RU: 'Волновахский' },
      },
      {
        key: 'dobropilskyi_district',
        title: { UA: 'Добропільський', EN: 'Dobropilskyi', RU: 'Добропольский' },
      },
      {
        key: 'kostiantynivskyi_district',
        title: { UA: 'Костянтинівський', EN: 'Kostiantynivskyi', RU: 'Константиновский' },
      },
      { key: 'lymanskyi_district', title: { UA: 'Лиманський', EN: 'Lymanskyi', RU: 'Лиманский' } },
      {
        key: 'manhushskyi_district',
        title: { UA: 'Мангушський', EN: 'Manhushskyi', RU: 'Мангушский' },
      },
      {
        key: 'marinskyi_district',
        title: { UA: "Мар'їнський", EN: 'Marinskyi', RU: 'Марьинский' },
      },
      {
        key: 'nikolskyi_district',
        title: { UA: 'Нікольський', EN: 'Nikolskyi', RU: 'Никольский' },
      },
      {
        key: 'novoazovskyi_district',
        title: { UA: 'Новоазовський', EN: 'Novoazovskyi', RU: 'Новоазовский' },
      },
      {
        key: 'oleksandrivskyi_district',
        title: { UA: 'Олександрівський', EN: 'Oleksandrivskyi', RU: 'Александровский' },
      },
      {
        key: 'pokrovskyi_district',
        title: { UA: 'Покровський', EN: 'Pokrovskyi', RU: 'Покровский' },
      },
      {
        key: 'slovianskyi_district',
        title: { UA: "Слов'янський", EN: 'Slovianskyi', RU: 'Славянский' },
      },
      {
        key: 'starobeshivskyi_district',
        title: { UA: 'Старобешівський', EN: 'Starobeshivskyi', RU: 'Старобешевский' },
      },
      {
        key: 'shakhtarskyi_district',
        title: { UA: 'Шахтарський', EN: 'Shakhtarskyi', RU: 'Шахтёрский' },
      },
      {
        key: 'yasynuvatskyi_district',
        title: { UA: 'Ясинуватський', EN: 'Yasynuvatskyi', RU: 'Ясиноватский' },
      },
    ],
    cities: [
      {
        key: 'avdiivka_city',
        title: { UA: 'Авдіївка', EN: 'Avdiivka', RU: 'Авдеевка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'amvrosiivka_city',
        title: { UA: 'Амвросіївка', EN: 'Amvrosiivka', RU: 'Амвросиевка' },
        centerOf: 'amvrosiivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bakhmut_city',
        title: { UA: 'Бахмут', EN: 'Bakhmut', RU: 'Бахмут' },
        centerOf: 'bakhmutskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'boikivske_town',
        title: { UA: 'Бойківське', EN: 'Boikivske', RU: 'Бойковское' },
        centerOf: 'boikivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'velyka_novosilka_town',
        title: { UA: 'Велика Новосілка', EN: 'Velyka Novosilka', RU: 'Великая Новоселка' },
        centerOf: 'velykonovosilkivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'volnovakha_city',
        title: { UA: 'Волноваха', EN: 'Volnovakha', RU: 'Волноваха' },
        centerOf: 'volnovaskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'vuhledar_city',
        title: { UA: 'Вугледар', EN: 'Vuhledar', RU: 'Угледар' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'horlivka_city',
        title: { UA: 'Горлівка', EN: 'Horlivka', RU: 'Горловка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'debaltseve_city',
        title: { UA: 'Дебальцеве', EN: 'Debaltseve', RU: 'Дебальцево' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'dobropillia_city',
        title: { UA: 'Добропілля', EN: 'Dobropillia', RU: 'Доброполье' },
        centerOf: 'dobropilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'dokuchaievsk_city',
        title: { UA: 'Докучаєвськ', EN: 'Dokuchaievsk', RU: 'Докучаевск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'donetsk_city',
        title: { UA: 'Донецьк', EN: 'Donetsk', RU: 'Донецк' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'druzhkivka_city',
        title: { UA: 'Дружківка', EN: 'Druzhkivka', RU: 'Дружковка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yenakiieve_city',
        title: { UA: 'Єнакієве', EN: 'Yenakiieve', RU: 'Енакиево' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'zhdanivka_city',
        title: { UA: 'Жданівка', EN: 'Zhdanivka', RU: 'Ждановка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kostiantynivka_city',
        title: { UA: 'Костянтинівка', EN: 'Kostiantynivka', RU: 'Константиновка' },
        centerOf: 'kostiantynivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kramatorsk_city',
        title: { UA: 'Краматорськ', EN: 'Kramatorsk', RU: 'Краматорск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lyman_city',
        title: { UA: 'Лиман', EN: 'Lyman', RU: 'Лиман' },
        centerOf: 'lymanskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'makiivka_city',
        title: { UA: 'Макіївка', EN: 'Makiivka', RU: 'Макеевка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'manhush_town',
        title: { UA: 'Мангуш', EN: 'Manhush', RU: 'Мангуш' },
        centerOf: 'manhushskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'marinka_city',
        title: { UA: "Мар'їнка", EN: 'Marinka', RU: 'Марьинка' },
        centerOf: 'marinskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'mariupol_city',
        title: { UA: 'Маріуполь', EN: 'Mariupol', RU: 'Мариуполь' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'myrnohrad_city',
        title: { UA: 'Мирноград', EN: 'Myrnohrad', RU: 'Мирноград' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nikolske_town',
        title: { UA: 'Нікольське', EN: 'Nikolske', RU: 'Никольское' },
        centerOf: 'nikolskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novoazovsk_city',
        title: { UA: 'Новоазовськ', EN: 'Novoazovsk', RU: 'Новоазовск' },
        centerOf: 'novoazovskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novohrodivka_city',
        title: { UA: 'Новогродівка', EN: 'Novohrodivka', RU: 'Новогродовка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'oleksandrivka_town',
        title: { UA: 'Олександрівка', EN: 'Oleksandrivka', RU: 'Александровка' },
        centerOf: 'oleksandrivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pokrovsk_city',
        title: { UA: 'Покровськ', EN: 'Pokrovsk', RU: 'Покровск' },
        centerOf: 'pokrovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'selydove_city',
        title: { UA: 'Селидове', EN: 'Selydove', RU: 'Селидово' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'sloviansk_city',
        title: { UA: "Слов'янськ", EN: 'Sloviansk', RU: 'Славянск' },
        centerOf: 'slovianskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'snizhne_city',
        title: { UA: 'Сніжне', EN: 'Snizhne', RU: 'Снежное' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'starobesheve_town',
        title: { UA: 'Старобешеве', EN: 'Starobesheve', RU: 'Старобешево' },
        centerOf: 'starobeshivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'toretsk_city',
        title: { UA: 'Торецьк', EN: 'Toretsk', RU: 'Торецк' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'khartsyzk_city',
        title: { UA: 'Харцизьк', EN: 'Khartsyzk', RU: 'Харцызск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'khrestivka_city',
        title: { UA: 'Хрестівка', EN: 'Khrestivka', RU: 'Крестовка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chystiakove_city',
        title: { UA: 'Чистякове', EN: 'Chystiakove', RU: 'Чистяково' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'shakhtarsk_city',
        title: { UA: 'Шахтарськ', EN: 'Shakhtarsk', RU: 'Шахтёрск' },
        centerOf: 'shakhtarskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yasynuvata_city',
        title: { UA: 'Ясинувата', EN: 'Yasynuvata', RU: 'Ясиноватая' },
        centerOf: 'yasynuvatskyi_district',
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'ZHYTOMYR_REGION',
    title: { UA: 'Житомирська', EN: 'Zhytomyr', RU: 'Житомирская' },
    districts: [
      {
        key: 'andrushivskyi_district',
        title: { UA: 'Андрушівський', EN: 'Andrushivskyi', RU: 'Андрушёвский' },
      },
      {
        key: 'baranivskyi_district',
        title: { UA: 'Баранівський', EN: 'Baranivskyi', RU: 'Барановский' },
      },
      {
        key: 'berdychivskyi_district',
        title: { UA: 'Бердичівський', EN: 'Berdychivskyi', RU: 'Бердичевский' },
      },
      {
        key: 'brusylivskyi_district',
        title: { UA: 'Брусилівський', EN: 'Brusylivskyi', RU: 'Брусиловский' },
      },
      {
        key: 'yemilchynskyi_district',
        title: { UA: 'Ємільчинський', EN: 'Yemilchynskyi', RU: 'Емильчинский' },
      },
      {
        key: 'zhytomyrskyi_district',
        title: { UA: 'Житомирський', EN: 'Zhytomyrskyi', RU: 'Житомирский' },
      },
      {
        key: 'korostenskyi_district',
        title: { UA: 'Коростенський', EN: 'Korostenskyi', RU: 'Коростенский' },
      },
      {
        key: 'korostyshivskyi_district',
        title: { UA: 'Коростишівський', EN: 'Korostyshivskyi', RU: 'Коростышевский' },
      },
      { key: 'luhynskyi_district', title: { UA: 'Лугинський', EN: 'Luhynskyi', RU: 'Лугинский' } },
      {
        key: 'liubarskyi_district',
        title: { UA: 'Любарський', EN: 'Liubarskyi', RU: 'Любарский' },
      },
      { key: 'malynskyi_district', title: { UA: 'Малинський', EN: 'Malynskyi', RU: 'Малинский' } },
      {
        key: 'narodytskyi_district',
        title: { UA: 'Народицький', EN: 'Narodytskyi', RU: 'Народичский' },
      },
      {
        key: 'novohrad_volynskyi_district',
        title: { UA: 'Новоград-Волинський', EN: 'Novohrad-Volynskyi', RU: 'Новоград-Волынский' },
      },
      { key: 'ovrutskyi_district', title: { UA: 'Овруцький', EN: 'Ovrutskyi', RU: 'Овручский' } },
      { key: 'olevskyi_district', title: { UA: 'Олевський', EN: 'Olevskyi', RU: 'Олевский' } },
      {
        key: 'popilnianskyi_district',
        title: { UA: 'Попільнянський', EN: 'Popilnianskyi', RU: 'Попельнянский' },
      },
      { key: 'pulynskyi_district', title: { UA: 'Пулинський', EN: 'Pulynskyi', RU: 'Пулинский' } },
      {
        key: 'radomyshlskyi_district',
        title: { UA: 'Радомишльський', EN: 'Radomyshlskyi', RU: 'Радомышльский' },
      },
      {
        key: 'romanivskyi_district',
        title: { UA: 'Романівський', EN: 'Romanivskyi', RU: 'Романовский' },
      },
      {
        key: 'ruzhynskyi_district',
        title: { UA: 'Ружинський', EN: 'Ruzhynskyi', RU: 'Ружинский' },
      },
      {
        key: 'khoroshivskyi_district',
        title: { UA: 'Хорошівський', EN: 'Khoroshivskyi', RU: 'Хорошевский' },
      },
      {
        key: 'cherniakhivskyi_district',
        title: { UA: 'Черняхівський', EN: 'Cherniakhivskyi', RU: 'Черняховский' },
      },
      {
        key: 'chudnivskyi_district',
        title: { UA: 'Чуднівський', EN: 'Chudnivskyi', RU: 'Чудновский' },
      },
    ],
    cities: [
      {
        key: 'andrushivka_city',
        title: { UA: 'Андрушівка', EN: 'Andrushivka', RU: 'Андрушевка' },
        centerOf: 'andrushivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'baranivka_city',
        title: { UA: 'Баранівка', EN: 'Baranivka', RU: 'Барановка' },
        centerOf: 'baranivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'berdychiv_city',
        title: { UA: 'Бердичів', EN: 'Berdychiv', RU: 'Бердичев' },
        centerOf: 'berdychivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'brusyliv_town',
        title: { UA: 'Брусилів', EN: 'Brusyliv', RU: 'Брусилов' },
        centerOf: 'brusylivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yemilchyne_town',
        title: { UA: 'Ємільчине', EN: 'Yemilchyne', RU: 'Емильчино' },
        centerOf: 'yemilchynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zhytomyr_city',
        title: { UA: 'Житомир', EN: 'Zhytomyr', RU: 'Житомир' },
        centerOf: 'zhytomyrskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'korosten_city',
        title: { UA: 'Коростень', EN: 'Korosten', RU: 'Коростень' },
        centerOf: 'korostenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'korostyshiv_city',
        title: { UA: 'Коростишів', EN: 'Korostyshiv', RU: 'Коростышев' },
        centerOf: 'korostyshivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'luhyny_town',
        title: { UA: 'Лугини', EN: 'Luhyny', RU: 'Лугины' },
        centerOf: 'luhynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'liubar_town',
        title: { UA: 'Любар', EN: 'Liubar', RU: 'Любар' },
        centerOf: 'liubarskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'malyn_city',
        title: { UA: 'Малин', EN: 'Malyn', RU: 'Малин' },
        centerOf: 'malynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'narodychi_town',
        title: { UA: 'Народичі', EN: 'Narodychi', RU: 'Народичи' },
        centerOf: 'narodytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novohrad_volynskyi_city',
        title: { UA: 'Новоград-Волинський', EN: 'Novohrad-Volynskyi', RU: 'Новоград-Волынский' },
        centerOf: 'novohrad_volynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'ovruch_city',
        title: { UA: 'Овруч', EN: 'Ovruch', RU: 'Овруч' },
        centerOf: 'ovrutskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'olevsk_city',
        title: { UA: 'Олевськ', EN: 'Olevsk', RU: 'Олевск' },
        centerOf: 'olevskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'popilnia_town',
        title: { UA: 'Попільня', EN: 'Popilnia', RU: 'Попельня' },
        centerOf: 'popilnianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pulyny_town',
        title: { UA: 'Пулини', EN: 'Pulyny', RU: 'Пулины' },
        centerOf: 'pulynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'radomyshl_city',
        title: { UA: 'Радомишль', EN: 'Radomyshl', RU: 'Радомышль' },
        centerOf: 'radomyshlskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'romaniv_town',
        title: { UA: 'Романів', EN: 'Romaniv', RU: 'Романов' },
        centerOf: 'romanivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ruzhyn_town',
        title: { UA: 'Ружин', EN: 'Ruzhyn', RU: 'Ружин' },
        centerOf: 'ruzhynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'khoroshiv_town',
        title: { UA: 'Хорошів', EN: 'Khoroshiv', RU: 'Хорошев' },
        centerOf: 'khoroshivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'cherniakhiv_town',
        title: { UA: 'Черняхів', EN: 'Cherniakhiv', RU: 'Черняхов' },
        centerOf: 'cherniakhivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'chudniv_city',
        title: { UA: 'Чуднів', EN: 'Chudniv', RU: 'Чуднов' },
        centerOf: 'chudnivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'ZAKARPATTIA_REGION',
    title: { UA: 'Закарпатська', EN: 'Zakarpattia', RU: 'Закарпатская' },
    districts: [
      {
        key: 'berehivskyi_district',
        title: { UA: 'Берегівський', EN: 'Berehivskyi', RU: 'Береговский' },
      },
      {
        key: 'velykobereznianskyi_district',
        title: { UA: 'Великоберезнянський', EN: 'Velykobereznianskyi', RU: 'Великоберезнянский' },
      },
      {
        key: 'vynohradivskyi_district',
        title: { UA: 'Виноградівський', EN: 'Vynohradivskyi', RU: 'Виноградовский' },
      },
      {
        key: 'volovetskyi_district',
        title: { UA: 'Воловецький', EN: 'Volovetskyi', RU: 'Воловецкий' },
      },
      {
        key: 'irshavskyi_district',
        title: { UA: 'Іршавський', EN: 'Irshavskyi', RU: 'Иршавский' },
      },
      {
        key: 'mizhhirskyi_district',
        title: { UA: 'Міжгірський', EN: 'Mizhhirskyi', RU: 'Межгорский' },
      },
      {
        key: 'mukachivskyi_district',
        title: { UA: 'Мукачівський', EN: 'Mukachivskyi', RU: 'Мукачевский' },
      },
      {
        key: 'perechynskyi_district',
        title: { UA: 'Перечинський', EN: 'Perechynskyi', RU: 'Перечинский' },
      },
      {
        key: 'rakhivskyi_district',
        title: { UA: 'Рахівський', EN: 'Rakhivskyi', RU: 'Раховский' },
      },
      {
        key: 'svaliavskyi_district',
        title: { UA: 'Свалявський', EN: 'Svaliavskyi', RU: 'Свалявский' },
      },
      {
        key: 'tiachivskyi_district',
        title: { UA: 'Тячівський', EN: 'Tiachivskyi', RU: 'Тячевский' },
      },
      {
        key: 'uzhhorodskyi_district',
        title: { UA: 'Ужгородський', EN: 'Uzhhorodskyi', RU: 'Ужгородский' },
      },
      { key: 'khustskyi_district', title: { UA: 'Хустський', EN: 'Khustskyi', RU: 'Хустский' } },
    ],
    cities: [
      {
        key: 'berehove_city',
        title: { UA: 'Берегове', EN: 'Berehove', RU: 'Берегово' },
        centerOf: 'berehivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'velykyi_bereznyi_town',
        title: { UA: 'Великий Березний', EN: 'Velykyi Bereznyi', RU: 'Великий Березный' },
        centerOf: 'velykobereznianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vynohradiv_city',
        title: { UA: 'Виноградів', EN: 'Vynohradiv', RU: 'Виноградов' },
        centerOf: 'vynohradivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'volovets_town',
        title: { UA: 'Воловець', EN: 'Volovets', RU: 'Воловец' },
        centerOf: 'volovetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'irshava_city',
        title: { UA: 'Іршава', EN: 'Irshava', RU: 'Иршава' },
        centerOf: 'irshavskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'mizhhiria_town',
        title: { UA: "Міжгір'я", EN: 'Mizhhiria', RU: 'Межгорье' },
        centerOf: 'mizhhirskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mukachevo_city',
        title: { UA: 'Мукачево', EN: 'Mukachevo', RU: 'Мукачево' },
        centerOf: 'mukachivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'perechyn_city',
        title: { UA: 'Перечин', EN: 'Perechyn', RU: 'Перечин' },
        centerOf: 'perechynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rakhiv_city',
        title: { UA: 'Рахів', EN: 'Rakhiv', RU: 'Рахов' },
        centerOf: 'rakhivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'svaliava_city',
        title: { UA: 'Свалява', EN: 'Svaliava', RU: 'Свалява' },
        centerOf: 'svaliavskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'tiachiv_city',
        title: { UA: 'Тячів', EN: 'Tiachiv', RU: 'Тячев' },
        centerOf: 'tiachivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'uzhhorod_city',
        title: { UA: 'Ужгород', EN: 'Uzhhorod', RU: 'Ужгород' },
        centerOf: 'uzhhorodskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'khust_city',
        title: { UA: 'Хуст', EN: 'Khust', RU: 'Хуст' },
        centerOf: 'khustskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chop_city',
        title: { UA: 'Чоп', EN: 'Chop', RU: 'Чоп' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'ZAPORIZHZHIA_REGION',
    title: { UA: 'Запорізька', EN: 'Zaporizhzhia', RU: 'Запорожская' },
    districts: [
      {
        key: 'berdianskyi_district',
        title: { UA: 'Бердянський', EN: 'Berdianskyi', RU: 'Бердянский' },
      },
      {
        key: 'bilmatskyi_district',
        title: { UA: 'Більмацький', EN: 'Bilmatskyi', RU: 'Бильмакский' },
      },
      {
        key: 'vasylivskyi_district',
        title: { UA: 'Василівський', EN: 'Vasylivskyi', RU: 'Васильевский' },
      },
      {
        key: 'velykobilozerskyi_district',
        title: { UA: 'Великобілозерський', EN: 'Velykobilozerskyi', RU: 'Великобелозёрский' },
      },
      {
        key: 'veselivskyi_district',
        title: { UA: 'Веселівський', EN: 'Veselivskyi', RU: 'Весёловский' },
      },
      {
        key: 'vilnianskyi_district',
        title: { UA: 'Вільнянський', EN: 'Vilnianskyi', RU: 'Вольнянский' },
      },
      {
        key: 'huliaipilskyi_district',
        title: { UA: 'Гуляйпільський', EN: 'Huliaipilskyi', RU: 'Гуляйпольский' },
      },
      {
        key: 'zaporizkyi_district',
        title: { UA: 'Запорізький', EN: 'Zaporizkyi', RU: 'Запорожский' },
      },
      {
        key: 'kamiansko_dniprovskyi_district',
        title: {
          UA: "Кам'янсько-Дніпровський",
          EN: 'Kamiansko-Dniprovskyi',
          RU: 'Каменско-Днепровский',
        },
      },
      {
        key: 'melitopolskyi_district',
        title: { UA: 'Мелітопольський', EN: 'Melitopolskyi', RU: 'Мелитопольский' },
      },
      {
        key: 'mykhailivskyi_district',
        title: { UA: 'Михайлівський', EN: 'Mykhailivskyi', RU: 'Михайловский' },
      },
      {
        key: 'novomykolaivskyi_district',
        title: { UA: 'Новомиколаївський', EN: 'Novomykolaivskyi', RU: 'Новониколаевский' },
      },
      {
        key: 'orikhivskyi_district',
        title: { UA: 'Оріхівський', EN: 'Orikhivskyi', RU: 'Ореховский' },
      },
      {
        key: 'polohivskyi_district',
        title: { UA: 'Пологівський', EN: 'Polohivskyi', RU: 'Пологовский' },
      },
      {
        key: 'pryazovskyi_district',
        title: { UA: 'Приазовський', EN: 'Pryazovskyi', RU: 'Приазовский' },
      },
      {
        key: 'prymorskyi_district',
        title: { UA: 'Приморський', EN: 'Prymorskyi', RU: 'Приморский' },
      },
      { key: 'rozivskyi_district', title: { UA: 'Розівський', EN: 'Rozivskyi', RU: 'Розовский' } },
      {
        key: 'tokmatskyi_district',
        title: { UA: 'Токмацький', EN: 'Tokmatskyi', RU: 'Токмакский' },
      },
      {
        key: 'chernihivskyi_district',
        title: { UA: 'Чернігівський', EN: 'Chernihivskyi', RU: 'Черниговский' },
      },
      {
        key: 'yakymivskyi_district',
        title: { UA: 'Якимівський', EN: 'Yakymivskyi', RU: 'Акимовский' },
      },
    ],
    cities: [
      {
        key: 'berdiansk_city',
        title: { UA: 'Бердянськ', EN: 'Berdiansk', RU: 'Бердянск' },
        centerOf: 'berdianskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bilmak_town',
        title: { UA: 'Більмак', EN: 'Bilmak', RU: 'Бильмак' },
        centerOf: 'bilmatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vasylivka_city',
        title: { UA: 'Василівка', EN: 'Vasylivka', RU: 'Васильевка' },
        centerOf: 'vasylivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'velyka_bilozerka_town',
        title: { UA: 'Велика Білозерка', EN: 'Velyka Bilozerka', RU: 'Великая Белозёрка' },
        centerOf: 'velykobilozerskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vesele_town',
        title: { UA: 'Веселе', EN: 'Vesele', RU: 'Веселое' },
        centerOf: 'veselivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vilniansk_city',
        title: { UA: 'Вільнянськ', EN: 'Vilniansk', RU: 'Вольнянск' },
        centerOf: 'vilnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'huliaipole_city',
        title: { UA: 'Гуляйполе', EN: 'Huliaipole', RU: 'Гуляйполе' },
        centerOf: 'huliaipilskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'enerhodar_city',
        title: { UA: 'Енергодар', EN: 'Enerhodar', RU: 'Энергодар' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'zaporizhzhia_city',
        title: { UA: 'Запоріжжя', EN: 'Zaporizhzhia', RU: 'Запорожье' },
        centerOf: 'zaporizkyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kamianka-dniprovska_city',
        title: { UA: "Кам'янка-Дніпровська", EN: 'Kamianka-Dniprovska', RU: 'Каменка-Днепровская' },
        centerOf: 'kamiansko_dniprovskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'melitopol_city',
        title: { UA: 'Мелітополь', EN: 'Melitopol', RU: 'Мелитополь' },
        centerOf: 'melitopolskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mykhailivka_town',
        title: { UA: 'Михайлівка', EN: 'Mykhailivka', RU: 'Михайловка' },
        centerOf: 'mykhailivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novomykolaivka_town',
        title: { UA: 'Новомиколаївка', EN: 'Novomykolaivka', RU: 'Новониколаевка' },
        centerOf: 'novomykolaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'orikhiv_city',
        title: { UA: 'Оріхів', EN: 'Orikhiv', RU: 'Орехов' },
        centerOf: 'orikhivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'polohy_city',
        title: { UA: 'Пологи', EN: 'Polohy', RU: 'Пологи' },
        centerOf: 'polohivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'pryazovske_town',
        title: { UA: 'Приазовське', EN: 'Pryazovske', RU: 'Приазовское' },
        centerOf: 'pryazovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'prymorsk_city',
        title: { UA: 'Приморськ', EN: 'Prymorsk', RU: 'Приморск' },
        centerOf: 'prymorskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rozivka_town',
        title: { UA: 'Розівка', EN: 'Rozivka', RU: 'Розовка' },
        centerOf: 'rozivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tokmak_city',
        title: { UA: 'Токмак', EN: 'Tokmak', RU: 'Токмак' },
        centerOf: 'tokmatskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chernihivka_town',
        title: { UA: 'Чернігівка', EN: 'Chernihivka', RU: 'Черниговка' },
        centerOf: 'chernihivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yakymivka_town',
        title: { UA: 'Якимівка', EN: 'Yakymivka', RU: 'Акимовка' },
        centerOf: 'yakymivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'IVANO_FRANKIVSK_REGION',
    title: { UA: 'Івано-Франківська', EN: 'Ivano-Frankivsk', RU: 'Ивано-Франковская' },
    districts: [
      {
        key: 'bohorodchanskyi_district',
        title: { UA: 'Богородчанський', EN: 'Bohorodchanskyi', RU: 'Богородчанский' },
      },
      {
        key: 'verkhovynskyi_district',
        title: { UA: 'Верховинський', EN: 'Verkhovynskyi', RU: 'Верховинский' },
      },
      { key: 'halytskyi_district', title: { UA: 'Галицький', EN: 'Halytskyi', RU: 'Галичский' } },
      {
        key: 'horodenkivskyi_district',
        title: { UA: 'Городенківський', EN: 'Horodenkivskyi', RU: 'Городенковский' },
      },
      { key: 'dolynskyi_district', title: { UA: 'Долинський', EN: 'Dolynskyi', RU: 'Долинский' } },
      { key: 'kaluskyi_district', title: { UA: 'Калуський', EN: 'Kaluskyi', RU: 'Калушский' } },
      {
        key: 'kolomyiskyi_district',
        title: { UA: 'Коломийський', EN: 'Kolomyiskyi', RU: 'Коломыйский' },
      },
      { key: 'kosivskyi_district', title: { UA: 'Косівський', EN: 'Kosivskyi', RU: 'Косовский' } },
      {
        key: 'nadvirnianskyi_district',
        title: { UA: 'Надвірнянський', EN: 'Nadvirnianskyi', RU: 'Надворнянский' },
      },
      {
        key: 'rohatynskyi_district',
        title: { UA: 'Рогатинський', EN: 'Rohatynskyi', RU: 'Рогатинский' },
      },
      {
        key: 'rozhniativskyi_district',
        title: { UA: 'Рожнятівський', EN: 'Rozhniativskyi', RU: 'Рожнятовский' },
      },
      {
        key: 'sniatynskyi_district',
        title: { UA: 'Снятинський', EN: 'Sniatynskyi', RU: 'Снятынский' },
      },
      {
        key: 'tysmenytskyi_district',
        title: { UA: 'Тисменицький', EN: 'Tysmenytskyi', RU: 'Тысменицкий' },
      },
      {
        key: 'tlumatskyi_district',
        title: { UA: 'Тлумацький', EN: 'Tlumatskyi', RU: 'Тлумачский' },
      },
    ],
    cities: [
      {
        key: 'bohorodchany_town',
        title: { UA: 'Богородчани', EN: 'Bohorodchany', RU: 'Богородчаны' },
        centerOf: 'bohorodchanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bolekhiv_city',
        title: { UA: 'Болехів', EN: 'Bolekhiv', RU: 'Болехов' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'burshtyn_city',
        title: { UA: 'Бурштин', EN: 'Burshtyn', RU: 'Бурштын' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'verkhovyna_town',
        title: { UA: 'Верховина', EN: 'Verkhovyna', RU: 'Верховина' },
        centerOf: 'verkhovynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'halych_city',
        title: { UA: 'Галич', EN: 'Halych', RU: 'Галич' },
        centerOf: 'halytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'horodenka_city',
        title: { UA: 'Городенка', EN: 'Horodenka', RU: 'Городенка' },
        centerOf: 'horodenkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'dolyna_city',
        title: { UA: 'Долина', EN: 'Dolyna', RU: 'Долина' },
        centerOf: 'dolynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'ivano_frankivsk_city',
        title: { UA: 'Івано-Франківськ', EN: 'Ivano-Frankivsk', RU: 'Ивано-Франковск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kalush_city',
        title: { UA: 'Калуш', EN: 'Kalush', RU: 'Калуш' },
        centerOf: 'kaluskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kolomyia_city',
        title: { UA: 'Коломия', EN: 'Kolomyia', RU: 'Коломыя' },
        centerOf: 'kolomyiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kosiv_city',
        title: { UA: 'Косів', EN: 'Kosiv', RU: 'Косов' },
        centerOf: 'kosivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'nadvirna_city',
        title: { UA: 'Надвірна', EN: 'Nadvirna', RU: 'Надворная' },
        centerOf: 'nadvirnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rohatyn_city',
        title: { UA: 'Рогатин', EN: 'Rohatyn', RU: 'Рогатин' },
        centerOf: 'rohatynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rozhniativ_town',
        title: { UA: 'Рожнятів', EN: 'Rozhniativ', RU: 'Рожнятов' },
        centerOf: 'rozhniativskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sniatyn_city',
        title: { UA: 'Снятин', EN: 'Sniatyn', RU: 'Снятын' },
        centerOf: 'sniatynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'tysmenytsia_city',
        title: { UA: 'Тисмениця', EN: 'Tysmenytsia', RU: 'Тысменица' },
        centerOf: 'tysmenytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'tlumach_city',
        title: { UA: 'Тлумач', EN: 'Tlumach', RU: 'Тлумач' },
        centerOf: 'tlumatskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'yaremche_city',
        title: { UA: 'Яремче', EN: 'Yaremche', RU: 'Яремче' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'KYIV_CITY_REGION',
    title: { UA: 'Київ', EN: 'Kyiv', RU: 'Киев' },
    districts: [
      {
        key: 'holosiivskyi_district',
        title: { UA: 'Голосіївський', EN: 'Holosiivskyi', RU: 'Голосеевский' },
      },
      {
        key: 'darnytskyi_district',
        title: { UA: 'Дарницький', EN: 'Darnytskyi', RU: 'Дарницкий' },
      },
      {
        key: 'desnianskyi_district',
        title: { UA: 'Деснянський', EN: 'Desnianskyi', RU: 'Деснянский' },
      },
      {
        key: 'dniprovskyi_district',
        title: { UA: 'Дніпровський', EN: 'Dniprovskyi', RU: 'Днепровский' },
      },
      {
        key: 'obolonskyi_district',
        title: { UA: 'Оболонський', EN: 'Obolonskyi', RU: 'Оболонский' },
      },
      {
        key: 'pecherskyi_district',
        title: { UA: 'Печерський', EN: 'Pecherskyi', RU: 'Печерский' },
      },
      {
        key: 'podilskyi_district',
        title: { UA: 'Подільський', EN: 'Podilskyi', RU: 'Подольский' },
      },
      {
        key: 'sviatoshynskyi_district',
        title: { UA: 'Святошинський', EN: 'Sviatoshynskyi', RU: 'Святошинский' },
      },
      {
        key: 'solomianskyi_district',
        title: { UA: "Солом'янський", EN: 'Solomianskyi', RU: 'Соломенский' },
      },
      {
        key: 'shevchenkivskyi_district',
        title: { UA: 'Шевченківський', EN: 'Shevchenkivskyi', RU: 'Шевченковский' },
      },
    ],
    cities: [
      {
        key: 'kyiv_city',
        title: { UA: 'Київ', EN: 'Kyiv', RU: 'Киев' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'KYIV_REGION',
    title: { UA: 'Київська', EN: 'Kyiv', RU: 'Киевская' },
    districts: [
      {
        key: 'baryshivskyi_district',
        title: { UA: 'Баришівський', EN: 'Baryshivskyi', RU: 'Барышевский' },
      },
      {
        key: 'bilotserkivskyi_district',
        title: { UA: 'Білоцерківський', EN: 'Bilotserkivskyi', RU: 'Белоцерковский' },
      },
      {
        key: 'bohuslavskyi_district',
        title: { UA: 'Богуславський', EN: 'Bohuslavskyi', RU: 'Богуславский' },
      },
      {
        key: 'boryspilskyi_district',
        title: { UA: 'Бориспільський', EN: 'Boryspilskyi', RU: 'Бориспольский' },
      },
      {
        key: 'borodianskyi_district',
        title: { UA: 'Бородянський', EN: 'Borodianskyi', RU: 'Бородянский' },
      },
      {
        key: 'brovarskyi_district',
        title: { UA: 'Броварський', EN: 'Brovarskyi', RU: 'Броварский' },
      },
      {
        key: 'vasylkivskyi_district',
        title: { UA: 'Васильківський', EN: 'Vasylkivskyi', RU: 'Васильковский' },
      },
      {
        key: 'vyshhorodskyi_district',
        title: { UA: 'Вишгородський', EN: 'Vyshhorodskyi', RU: 'Вышгородский' },
      },
      {
        key: 'volodarskyi_district',
        title: { UA: 'Володарський', EN: 'Volodarskyi', RU: 'Володарский' },
      },
      {
        key: 'zghurivskyi_district',
        title: { UA: 'Згурівський', EN: 'Zghurivskyi', RU: 'Згуровский' },
      },
      {
        key: 'ivankivskyi_district',
        title: { UA: 'Іванківський', EN: 'Ivankivskyi', RU: 'Иванковский' },
      },
      {
        key: 'kaharlytskyi_district',
        title: { UA: 'Кагарлицький', EN: 'Kaharlytskyi', RU: 'Кагарлыкский' },
      },
      {
        key: 'kyievo_sviatoshynskyi_district',
        title: { UA: 'Києво-Святошинський', EN: 'Kyievo-Sviatoshynskyi', RU: 'Киево-Святошинский' },
      },
      {
        key: 'makarivskyi_district',
        title: { UA: 'Макарівський', EN: 'Makarivskyi', RU: 'Макаровский' },
      },
      {
        key: 'myronivskyi_district',
        title: { UA: 'Миронівський', EN: 'Myronivskyi', RU: 'Мироновский' },
      },
      {
        key: 'obukhivskyi_district',
        title: { UA: 'Обухівський', EN: 'Obukhivskyi', RU: 'Обуховский' },
      },
      {
        key: 'pereiaslav_khmelnytskyi_district',
        title: {
          UA: 'Переяслав-Хмельницький',
          EN: 'Pereiaslav-Khmelnytskyi',
          RU: 'Переяслав-Хмельницкий',
        },
      },
      { key: 'poliskyi_district', title: { UA: 'Поліський', EN: 'Poliskyi', RU: 'Полесский' } },
      {
        key: 'rokytnianskyi_district',
        title: { UA: 'Рокитнянський', EN: 'Rokytnianskyi', RU: 'Ракитнянский' },
      },
      { key: 'skvyrskyi_district', title: { UA: 'Сквирський', EN: 'Skvyrskyi', RU: 'Сквирский' } },
      {
        key: 'stavyshchenskyi_district',
        title: { UA: 'Ставищенський', EN: 'Stavyshchenskyi', RU: 'Ставищенский' },
      },
      {
        key: 'tarashchanskyi_district',
        title: { UA: 'Таращанський', EN: 'Tarashchanskyi', RU: 'Таращанский' },
      },
      {
        key: 'tetiivskyi_district',
        title: { UA: 'Тетіївський', EN: 'Tetiivskyi', RU: 'Тетиевский' },
      },
      {
        key: 'fastivskyi_district',
        title: { UA: 'Фастівський', EN: 'Fastivskyi', RU: 'Фастовский' },
      },
      {
        key: 'yahotynskyi_district',
        title: { UA: 'Яготинський', EN: 'Yahotynskyi', RU: 'Яготинский' },
      },
    ],
    cities: [
      {
        key: 'baryshivka_town',
        title: { UA: 'Баришівка', EN: 'Baryshivka', RU: 'Барышевка' },
        centerOf: 'baryshivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'berezan_city',
        title: { UA: 'Березань', EN: 'Berezan', RU: 'Березань' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bila_tserkva_city',
        title: { UA: 'Біла Церква', EN: 'Bila Tserkva', RU: 'Белая Церковь' },
        centerOf: 'bilotserkivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bohuslav_city',
        title: { UA: 'Богуслав', EN: 'Bohuslav', RU: 'Богуслав' },
        centerOf: 'bohuslavskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'boryspil_city',
        title: { UA: 'Бориспіль', EN: 'Boryspil', RU: 'Борисполь' },
        centerOf: 'boryspilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'borodianka_town',
        title: { UA: 'Бородянка', EN: 'Borodianka', RU: 'Бородянка' },
        centerOf: 'borodianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'brovary_city',
        title: { UA: 'Бровари', EN: 'Brovary', RU: 'Бровары' },
        centerOf: 'brovarskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bucha_city',
        title: { UA: 'Буча', EN: 'Bucha', RU: 'Буча' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'vasylkiv_city',
        title: { UA: 'Васильків', EN: 'Vasylkiv', RU: 'Васильков' },
        centerOf: 'vasylkivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'vyshhorod_city',
        title: { UA: 'Вишгород', EN: 'Vyshhorod', RU: 'Вышгород' },
        centerOf: 'vyshhorodskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'volodarka_town',
        title: { UA: 'Володарка', EN: 'Volodarka', RU: 'Володарка' },
        centerOf: 'volodarskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zghurivka_town',
        title: { UA: 'Згурівка', EN: 'Zghurivka', RU: 'Згуровка' },
        centerOf: 'zghurivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ivankiv_town',
        title: { UA: 'Іванків', EN: 'Ivankiv', RU: 'Иванков' },
        centerOf: 'ivankivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'irpin_city',
        title: { UA: 'Ірпінь', EN: 'Irpin', RU: 'Ирпень' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kaharlyk_city',
        title: { UA: 'Кагарлик', EN: 'Kaharlyk', RU: 'Кагарлык' },
        centerOf: 'kaharlytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kyiv_city',
        title: { UA: 'Київ', EN: 'Kyiv', RU: 'Киев' },
        centerOf: 'kyievo_sviatoshynskyi_district',
        type: CityType.SYMLINK,
      },
      {
        key: 'krasiatychi_town',
        title: { UA: 'Красятичі', EN: 'Krasiatychi', RU: 'Красятичи' },
        centerOf: 'poliskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'makariv_town',
        title: { UA: 'Макарів', EN: 'Makariv', RU: 'Макаров' },
        centerOf: 'makarivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'myronivka_city',
        title: { UA: 'Миронівка', EN: 'Myronivka', RU: 'Мироновка' },
        centerOf: 'myronivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'obukhiv_city',
        title: { UA: 'Обухів', EN: 'Obukhiv', RU: 'Обухов' },
        centerOf: 'obukhivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'pereiaslav_city',
        title: { UA: 'Переяслав', EN: 'Pereiaslav', RU: 'Переяслав' },
        centerOf: 'pereiaslav_khmelnytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'prypiat_city',
        title: { UA: "Прип'ять", EN: 'Prypiat', RU: 'Припять' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'rzhyshchiv_city',
        title: { UA: 'Ржищів', EN: 'Rzhyshchiv', RU: 'Ржищев' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'rokytne_town',
        title: { UA: 'Рокитне', EN: 'Rokytne', RU: 'Ракитное' },
        centerOf: 'rokytnianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'skvyra_city',
        title: { UA: 'Сквира', EN: 'Skvyra', RU: 'Сквира' },
        centerOf: 'skvyrskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'slavutych_city',
        title: { UA: 'Славутич', EN: 'Slavutych', RU: 'Славутич' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'stavyshche_town',
        title: { UA: 'Ставище', EN: 'Stavyshche', RU: 'Ставище' },
        centerOf: 'stavyshchenskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tarashcha_city',
        title: { UA: 'Тараща', EN: 'Tarashcha', RU: 'Тараща' },
        centerOf: 'tarashchanskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'tetiiv_city',
        title: { UA: 'Тетіїв', EN: 'Tetiiv', RU: 'Тетиев' },
        centerOf: 'tetiivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'fastiv_city',
        title: { UA: 'Фастів', EN: 'Fastiv', RU: 'Фастов' },
        centerOf: 'fastivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yahotyn_city',
        title: { UA: 'Яготин', EN: 'Yahotyn', RU: 'Яготин' },
        centerOf: 'yahotynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'KIROVOHRAD_REGION',
    title: { UA: 'Кіровоградська', EN: 'Kirovohrad', RU: 'Кировоградская' },
    districts: [
      {
        key: 'blahovishchenskyi_district',
        title: { UA: 'Благовіщенський', EN: 'Blahovishchenskyi', RU: 'Благовещенский' },
      },
      {
        key: 'bobrynetskyi_district',
        title: { UA: 'Бобринецький', EN: 'Bobrynetskyi', RU: 'Бобринецкий' },
      },
      {
        key: 'vilshanskyi_district',
        title: { UA: 'Вільшанський', EN: 'Vilshanskyi', RU: 'Ольшанский' },
      },
      {
        key: 'haivoronskyi_district',
        title: { UA: 'Гайворонський', EN: 'Haivoronskyi', RU: 'Гайворонский' },
      },
      {
        key: 'holovanivskyi_district',
        title: { UA: 'Голованівський', EN: 'Holovanivskyi', RU: 'Голованевский' },
      },
      {
        key: 'dobrovelychkivskyi_district',
        title: { UA: 'Добровеличківський', EN: 'Dobrovelychkivskyi', RU: 'Добровеличковский' },
      },
      { key: 'dolynskyi_district', title: { UA: 'Долинський', EN: 'Dolynskyi', RU: 'Долинский' } },
      {
        key: 'znamianskyi_district',
        title: { UA: "Знам'янський", EN: 'Znamianskyi', RU: 'Знаменский' },
      },
      {
        key: 'kompaniivskyi_district',
        title: { UA: 'Компаніївський', EN: 'Kompaniivskyi', RU: 'Компанеевский' },
      },
      {
        key: 'kropyvnytskyi_district',
        title: { UA: 'Кропивницький', EN: 'Kropyvnytskyi', RU: 'Кропивницкий' },
      },
      {
        key: 'malovyskivskyi_district',
        title: { UA: 'Маловисківський', EN: 'Malovyskivskyi', RU: 'Маловисковский' },
      },
      {
        key: 'novhorodkivskyi_district',
        title: { UA: 'Новгородківський', EN: 'Novhorodkivskyi', RU: 'Новгородковский' },
      },
      {
        key: 'novoarkhanhelskyi_district',
        title: { UA: 'Новоархангельський', EN: 'Novoarkhanhelskyi', RU: 'Новоархангельский' },
      },
      {
        key: 'novomyrhorodskyi_district',
        title: { UA: 'Новомиргородський', EN: 'Novomyrhorodskyi', RU: 'Новомиргородский' },
      },
      {
        key: 'novoukrainskyi_district',
        title: { UA: 'Новоукраїнський', EN: 'Novoukrainskyi', RU: 'Новоукраинский' },
      },
      {
        key: 'oleksandrivskyi_district',
        title: { UA: 'Олександрівський', EN: 'Oleksandrivskyi', RU: 'Александровский' },
      },
      {
        key: 'oleksandriiskyi_district',
        title: { UA: 'Олександрійський', EN: 'Oleksandriiskyi', RU: 'Александрийский' },
      },
      {
        key: 'onufriivskyi_district',
        title: { UA: 'Онуфріївський', EN: 'Onufriivskyi', RU: 'Онуфриевский' },
      },
      {
        key: 'petrivskyi_district',
        title: { UA: 'Петрівський', EN: 'Petrivskyi', RU: 'Петровский' },
      },
      {
        key: 'svitlovodskyi_district',
        title: { UA: 'Світловодський', EN: 'Svitlovodskyi', RU: 'Светловодский' },
      },
      {
        key: 'ustynivskyi_district',
        title: { UA: 'Устинівський', EN: 'Ustynivskyi', RU: 'Устиновский' },
      },
    ],
    cities: [
      {
        key: 'blahovishchenske_city',
        title: { UA: 'Благовіщенське', EN: 'Blahovishchenske', RU: 'Благовещенское' },
        centerOf: 'blahovishchenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bobrynets_city',
        title: { UA: 'Бобринець', EN: 'Bobrynets', RU: 'Бобринец' },
        centerOf: 'bobrynetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'vilshanka_town',
        title: { UA: 'Вільшанка', EN: 'Vilshanka', RU: 'Ольшанка' },
        centerOf: 'vilshanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'haivoron_city',
        title: { UA: 'Гайворон', EN: 'Haivoron', RU: 'Гайворон' },
        centerOf: 'haivoronskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'holovanivsk_town',
        title: { UA: 'Голованівськ', EN: 'Holovanivsk', RU: 'Голованевск' },
        centerOf: 'holovanivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'dobrovelychkivka_town',
        title: { UA: 'Добровеличківка', EN: 'Dobrovelychkivka', RU: 'Добровеличковка' },
        centerOf: 'dobrovelychkivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'dolynska_city',
        title: { UA: 'Долинська', EN: 'Dolynska', RU: 'Долинская' },
        centerOf: 'dolynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'znamianka_city',
        title: { UA: "Знам'янка", EN: 'Znamianka', RU: 'Знаменка' },
        centerOf: 'znamianskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kompaniivka_town',
        title: { UA: 'Компаніївка', EN: 'Kompaniivka', RU: 'Компанеевка' },
        centerOf: 'kompaniivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kropyvnytskyi_city',
        title: { UA: 'Кропивницький', EN: 'Kropyvnytskyi', RU: 'Кропивницкий' },
        centerOf: 'kropyvnytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mala_vyska_city',
        title: { UA: 'Мала Виска', EN: 'Mala Vyska', RU: 'Малая Виска' },
        centerOf: 'malovyskivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novhorodka_town',
        title: { UA: 'Новгородка', EN: 'Novhorodka', RU: 'Новгородка' },
        centerOf: 'novhorodkivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novoarkhanhelsk_town',
        title: { UA: 'Новоархангельськ', EN: 'Novoarkhanhelsk', RU: 'Новоархангельск' },
        centerOf: 'novoarkhanhelskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novomyrhorod_city',
        title: { UA: 'Новомиргород', EN: 'Novomyrhorod', RU: 'Новомиргород' },
        centerOf: 'novomyrhorodskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novoukrainka_city',
        title: { UA: 'Новоукраїнка', EN: 'Novoukrainka', RU: 'Новоукраинка' },
        centerOf: 'novoukrainskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'oleksandrivka_town',
        title: { UA: 'Олександрівка', EN: 'Oleksandrivka', RU: 'Александровка' },
        centerOf: 'oleksandrivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'oleksandriia_city',
        title: { UA: 'Олександрія', EN: 'Oleksandriia', RU: 'Александрия' },
        centerOf: 'oleksandriiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'onufriivka_town',
        title: { UA: 'Онуфріївка', EN: 'Onufriivka', RU: 'Онуфриевка' },
        centerOf: 'onufriivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'petrove_town',
        title: { UA: 'Петрове', EN: 'Petrove', RU: 'Петрово' },
        centerOf: 'petrivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'svitlovodsk_city',
        title: { UA: 'Світловодськ', EN: 'Svitlovodsk', RU: 'Светловодск' },
        centerOf: 'svitlovodskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'ustynivka_town',
        title: { UA: 'Устинівка', EN: 'Ustynivka', RU: 'Устиновка' },
        centerOf: 'ustynivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'LUHANSK_REGION',
    title: { UA: 'Луганська', EN: 'Luhansk', RU: 'Луганская' },
    districts: [
      {
        key: 'antratsytivskyi_district',
        title: { UA: 'Антрацитівський', EN: 'Antratsytivskyi', RU: 'Антрацитовский' },
      },
      {
        key: 'bilovodskyi_district',
        title: { UA: 'Біловодський', EN: 'Bilovodskyi', RU: 'Беловодский' },
      },
      {
        key: 'bilokurakynskyi_district',
        title: { UA: 'Білокуракинський', EN: 'Bilokurakynskyi', RU: 'Белокуракинский' },
      },
      {
        key: 'dovzhanskyi_district',
        title: { UA: 'Довжанський', EN: 'Dovzhanskyi', RU: 'Должанский' },
      },
      {
        key: 'kreminskyi_district',
        title: { UA: 'Кремінський', EN: 'Kreminskyi', RU: 'Кременский' },
      },
      {
        key: 'lutuhynskyi_district',
        title: { UA: 'Лутугинський', EN: 'Lutuhynskyi', RU: 'Лутугинский' },
      },
      {
        key: 'markivskyi_district',
        title: { UA: 'Марківський', EN: 'Markivskyi', RU: 'Марковский' },
      },
      { key: 'milovskyi_district', title: { UA: 'Міловський', EN: 'Milovskyi', RU: 'Меловской' } },
      {
        key: 'novoaidarskyi_district',
        title: { UA: 'Новоайдарський', EN: 'Novoaidarskyi', RU: 'Новоайдарский' },
      },
      {
        key: 'novopskovskyi_district',
        title: { UA: 'Новопсковський', EN: 'Novopskovskyi', RU: 'Новопсковский' },
      },
      {
        key: 'perevalskyi_district',
        title: { UA: 'Перевальський', EN: 'Perevalskyi', RU: 'Перевальский' },
      },
      {
        key: 'popasnianskyi_district',
        title: { UA: 'Попаснянський', EN: 'Popasnianskyi', RU: 'Попаснянский' },
      },
      {
        key: 'svativskyi_district',
        title: { UA: 'Сватівський', EN: 'Svativskyi', RU: 'Сватовский' },
      },
      {
        key: 'slovianoserbskyi_district',
        title: { UA: "Слов'яносербський", EN: 'Slovianoserbskyi', RU: 'Славяносербский' },
      },
      {
        key: 'sorokynskyi_district',
        title: { UA: 'Сорокинський', EN: 'Sorokynskyi', RU: 'Сорокинский' },
      },
      {
        key: 'stanychno_luhanskyi_district',
        title: { UA: 'Станично-Луганський', EN: 'Stanychno-Luhanskyi', RU: 'Станично-Луганский' },
      },
      {
        key: 'starobilskyi_district',
        title: { UA: 'Старобільський', EN: 'Starobilskyi', RU: 'Старобельский' },
      },
      { key: 'troitskyi_district', title: { UA: 'Троїцький', EN: 'Troitskyi', RU: 'Троицкий' } },
    ],
    cities: [
      {
        key: 'alchevsk_city',
        title: { UA: 'Алчевськ', EN: 'Alchevsk', RU: 'Алчевск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'antratsyt_city',
        title: { UA: 'Антрацит', EN: 'Antratsyt', RU: 'Антрацит' },
        centerOf: 'antratsytivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bilovodsk_town',
        title: { UA: 'Біловодськ', EN: 'Bilovodsk', RU: 'Беловодск' },
        centerOf: 'bilovodskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bilokurakyne_town',
        title: { UA: 'Білокуракине', EN: 'Bilokurakyne', RU: 'Белокуракино' },
        centerOf: 'bilokurakynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'brianka_city',
        title: { UA: 'Брянка', EN: 'Brianka', RU: 'Брянка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'holubivka_city',
        title: { UA: 'Голубівка', EN: 'Holubivka', RU: 'Голубовка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'dovzhansk_city',
        title: { UA: 'Довжанськ', EN: 'Dovzhansk', RU: 'Должанск' },
        centerOf: 'dovzhanskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kadiivka_city',
        title: { UA: 'Кадіївка', EN: 'Kadiivka', RU: 'Кадиевка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kreminna_city',
        title: { UA: 'Кремінна', EN: 'Kreminna', RU: 'Кременная' },
        centerOf: 'kreminskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lysychansk_city',
        title: { UA: 'Лисичанськ', EN: 'Lysychansk', RU: 'Лисичанск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'luhansk_city',
        title: { UA: 'Луганськ', EN: 'Luhansk', RU: 'Луганск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lutuhyne_city',
        title: { UA: 'Лутугине', EN: 'Lutuhyne', RU: 'Лутугино' },
        centerOf: 'lutuhynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'markivka_town',
        title: { UA: 'Марківка', EN: 'Markivka', RU: 'Марковка' },
        centerOf: 'markivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'milove_town',
        title: { UA: 'Мілове', EN: 'Milove', RU: 'Меловое' },
        centerOf: 'milovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novoaidar_town',
        title: { UA: 'Новоайдар', EN: 'Novoaidar', RU: 'Новоайдар' },
        centerOf: 'novoaidarskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novopskov_town',
        title: { UA: 'Новопсков', EN: 'Novopskov', RU: 'Новопсков' },
        centerOf: 'novopskovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pervomaisk_city',
        title: { UA: 'Первомайськ', EN: 'Pervomaisk', RU: 'Первомайск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'perevalsk_city',
        title: { UA: 'Перевальськ', EN: 'Perevalsk', RU: 'Перевальск' },
        centerOf: 'perevalskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'popasna_city',
        title: { UA: 'Попасна', EN: 'Popasna', RU: 'Попасная' },
        centerOf: 'popasnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rovenky_city',
        title: { UA: 'Ровеньки', EN: 'Rovenky', RU: 'Ровеньки' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'rubizhne_city',
        title: { UA: 'Рубіжне', EN: 'Rubizhne', RU: 'Рубежное' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'svatove_city',
        title: { UA: 'Сватове', EN: 'Svatove', RU: 'Сватово' },
        centerOf: 'svativskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'sievierodonetsk_city',
        title: { UA: 'Сєвєродонецьк', EN: 'Sievierodonetsk', RU: 'Северодонецк' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'slovianoserbsk_town',
        title: { UA: "Слов'яносербськ", EN: 'Slovianoserbsk', RU: 'Славяносербск' },
        centerOf: 'slovianoserbskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sorokyne_city',
        title: { UA: 'Сорокине', EN: 'Sorokyne', RU: 'Сорокино' },
        centerOf: 'sorokynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'stanytsia_luhanska_town',
        title: { UA: 'Станиця Луганська', EN: 'Stanytsia Luhanska', RU: 'Станица Луганская' },
        centerOf: 'stanychno_luhanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'starobilsk_city',
        title: { UA: 'Старобільськ', EN: 'Starobilsk', RU: 'Старобельск' },
        centerOf: 'starobilskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'troitske_town',
        title: { UA: 'Троїцьке', EN: 'Troitske', RU: 'Троицкое' },
        centerOf: 'troitskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'khrustalnyi_city',
        title: { UA: 'Хрустальний', EN: 'Khrustalnyi', RU: 'Хрустальный' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'LVIV_REGION',
    title: { UA: 'Львівська', EN: 'Lviv', RU: 'Львовская' },
    districts: [
      {
        key: 'brodivskyi_district',
        title: { UA: 'Бродівський', EN: 'Brodivskyi', RU: 'Бродовский' },
      },
      { key: 'buskyi_district', title: { UA: 'Буський', EN: 'Buskyi', RU: 'Бусский' } },
      {
        key: 'horodotskyi_district',
        title: { UA: 'Городоцький', EN: 'Horodotskyi', RU: 'Городокский' },
      },
      {
        key: 'drohobytskyi_district',
        title: { UA: 'Дрогобицький', EN: 'Drohobytskyi', RU: 'Дрогобычский' },
      },
      {
        key: 'zhydachivskyi_district',
        title: { UA: 'Жидачівський', EN: 'Zhydachivskyi', RU: 'Жидачовский' },
      },
      {
        key: 'zhovkivskyi_district',
        title: { UA: 'Жовківський', EN: 'Zhovkivskyi', RU: 'Жолковский' },
      },
      {
        key: 'zolochivskyi_district',
        title: { UA: 'Золочівський', EN: 'Zolochivskyi', RU: 'Золочевский' },
      },
      {
        key: 'kamianka_buzkyi_district',
        title: { UA: "Кам'янка-Бузький", EN: 'Kamianka-Buzkyi', RU: 'Каменка-Бугский' },
      },
      {
        key: 'mykolaivskyi_district',
        title: { UA: 'Миколаївський', EN: 'Mykolaivskyi', RU: 'Николаевский' },
      },
      { key: 'mostyskyi_district', title: { UA: 'Мостиський', EN: 'Mostyskyi', RU: 'Мостисский' } },
      {
        key: 'peremyshlianskyi_district',
        title: { UA: 'Перемишлянський', EN: 'Peremyshlianskyi', RU: 'Перемышлянский' },
      },
      {
        key: 'pustomytivskyi_district',
        title: { UA: 'Пустомитівський', EN: 'Pustomytivskyi', RU: 'Пустомытовский' },
      },
      {
        key: 'radekhivskyi_district',
        title: { UA: 'Радехівський', EN: 'Radekhivskyi', RU: 'Радеховский' },
      },
      {
        key: 'sambirskyi_district',
        title: { UA: 'Самбірський', EN: 'Sambirskyi', RU: 'Самборский' },
      },
      {
        key: 'skolivskyi_district',
        title: { UA: 'Сколівський', EN: 'Skolivskyi', RU: 'Сколевский' },
      },
      {
        key: 'sokalskyi_district',
        title: { UA: 'Сокальський', EN: 'Sokalskyi', RU: 'Сокальский' },
      },
      {
        key: 'starosambirskyi_district',
        title: { UA: 'Старосамбірський', EN: 'Starosambirskyi', RU: 'Старосамборский' },
      },
      { key: 'stryiskyi_district', title: { UA: 'Стрийський', EN: 'Stryiskyi', RU: 'Стрыйский' } },
      {
        key: 'turkivskyi_district',
        title: { UA: 'Турківський', EN: 'Turkivskyi', RU: 'Турковский' },
      },
      {
        key: 'yavorivskyi_district',
        title: { UA: 'Яворівський', EN: 'Yavorivskyi', RU: 'Яворовский' },
      },
    ],
    cities: [
      {
        key: 'boryslav_city',
        title: { UA: 'Борислав', EN: 'Boryslav', RU: 'Борислав' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'brody_city',
        title: { UA: 'Броди', EN: 'Brody', RU: 'Броды' },
        centerOf: 'brodivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'busk_city',
        title: { UA: 'Буськ', EN: 'Busk', RU: 'Буск' },
        centerOf: 'buskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'horodok_city',
        title: { UA: 'Городок', EN: 'Horodok', RU: 'Городок' },
        centerOf: 'horodotskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'drohobych_city',
        title: { UA: 'Дрогобич', EN: 'Drohobych', RU: 'Дрогобыч' },
        centerOf: 'drohobytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'zhydachiv_city',
        title: { UA: 'Жидачів', EN: 'Zhydachiv', RU: 'Жидачов' },
        centerOf: 'zhydachivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zhovkva_city',
        title: { UA: 'Жовква', EN: 'Zhovkva', RU: 'Жолква' },
        centerOf: 'zhovkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zolochiv_city',
        title: { UA: 'Золочів', EN: 'Zolochiv', RU: 'Золочев' },
        centerOf: 'zolochivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kamianka_buzka_city',
        title: { UA: "Кам'янка-Бузька", EN: 'Kamianka-Buzka', RU: 'Каменка-Бугская' },
        centerOf: 'kamianka_buzkyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lviv_city',
        title: { UA: 'Львів', EN: 'Lviv', RU: 'Львов' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mykolaiv_city',
        title: { UA: 'Миколаїв', EN: 'Mykolaiv', RU: 'Николаев' },
        centerOf: 'mykolaivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'morshyn_city',
        title: { UA: 'Моршин', EN: 'Morshyn', RU: 'Моршин' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mostyska_city',
        title: { UA: 'Мостиська', EN: 'Mostyska', RU: 'Мостиска' },
        centerOf: 'mostyskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novyi_rozdil_city',
        title: { UA: 'Новий Розділ', EN: 'Novyi Rozdil', RU: 'Новый Раздол' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'peremyshliany_city',
        title: { UA: 'Перемишляни', EN: 'Peremyshliany', RU: 'Перемышляны' },
        centerOf: 'peremyshlianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'pustomyty_city',
        title: { UA: 'Пустомити', EN: 'Pustomyty', RU: 'Пустомыты' },
        centerOf: 'pustomytivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'radekhiv_city',
        title: { UA: 'Радехів', EN: 'Radekhiv', RU: 'Радехов' },
        centerOf: 'radekhivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'sambir_city',
        title: { UA: 'Самбір', EN: 'Sambir', RU: 'Самбор' },
        centerOf: 'sambirskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'skole_city',
        title: { UA: 'Сколе', EN: 'Skole', RU: 'Сколе' },
        centerOf: 'skolivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'sokal_city',
        title: { UA: 'Сокаль', EN: 'Sokal', RU: 'Сокаль' },
        centerOf: 'sokalskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'staryi_sambir_city',
        title: { UA: 'Старий Самбір', EN: 'Staryi Sambir', RU: 'Старый Самбор' },
        centerOf: 'starosambirskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'stryi_city',
        title: { UA: 'Стрий', EN: 'Stryi', RU: 'Стрый' },
        centerOf: 'stryiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'truskavets_city',
        title: { UA: 'Трускавець', EN: 'Truskavets', RU: 'Трускавец' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'turka_city',
        title: { UA: 'Турка', EN: 'Turka', RU: 'Турка' },
        centerOf: 'turkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'chervonohrad_city',
        title: { UA: 'Червоноград', EN: 'Chervonohrad', RU: 'Червоноград' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yavoriv_city',
        title: { UA: 'Яворів', EN: 'Yavoriv', RU: 'Яворов' },
        centerOf: 'yavorivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'MYKOLAIV_REGION',
    title: { UA: 'Миколаївська', EN: 'Mykolaiv', RU: 'Николаевская' },
    districts: [
      {
        key: 'arbuzynskyi_district',
        title: { UA: 'Арбузинський', EN: 'Arbuzynskyi', RU: 'Арбузинский' },
      },
      {
        key: 'bashtanskyi_district',
        title: { UA: 'Баштанський', EN: 'Bashtanskyi', RU: 'Баштанский' },
      },
      {
        key: 'berezanskyi_district',
        title: { UA: 'Березанський', EN: 'Berezanskyi', RU: 'Березанский' },
      },
      {
        key: 'bereznehuvatskyi_district',
        title: { UA: 'Березнегуватський', EN: 'Bereznehuvatskyi', RU: 'Березнеговатский' },
      },
      { key: 'bratskyi_district', title: { UA: 'Братський', EN: 'Bratskyi', RU: 'Братский' } },
      {
        key: 'veselynivskyi_district',
        title: { UA: 'Веселинівський', EN: 'Veselynivskyi', RU: 'Веселиновский' },
      },
      { key: 'vitovskyi_district', title: { UA: 'Вітовський', EN: 'Vitovskyi', RU: 'Витовский' } },
      {
        key: 'voznesenskyi_district',
        title: { UA: 'Вознесенський', EN: 'Voznesenskyi', RU: 'Вознесенский' },
      },
      {
        key: 'vradiivskyi_district',
        title: { UA: 'Врадіївський', EN: 'Vradiivskyi', RU: 'Врадиевский' },
      },
      {
        key: 'domanivskyi_district',
        title: { UA: 'Доманівський', EN: 'Domanivskyi', RU: 'Доманёвский' },
      },
      {
        key: 'yelanetskyi_district',
        title: { UA: 'Єланецький', EN: 'Yelanetskyi', RU: 'Еланецкий' },
      },
      {
        key: 'kazankivskyi_district',
        title: { UA: 'Казанківський', EN: 'Kazankivskyi', RU: 'Казанковский' },
      },
      {
        key: 'kryvoozerskyi_district',
        title: { UA: 'Кривоозерський', EN: 'Kryvoozerskyi', RU: 'Кривоозерский' },
      },
      {
        key: 'mykolaivskyi_district',
        title: { UA: 'Миколаївський', EN: 'Mykolaivskyi', RU: 'Николаевский' },
      },
      {
        key: 'novobuzkyi_district',
        title: { UA: 'Новобузький', EN: 'Novobuzkyi', RU: 'Новобугский' },
      },
      {
        key: 'novoodeskyi_district',
        title: { UA: 'Новоодеський', EN: 'Novoodeskyi', RU: 'Новоодесский' },
      },
      {
        key: 'ochakivskyi_district',
        title: { UA: 'Очаківський', EN: 'Ochakivskyi', RU: 'Очаковский' },
      },
      {
        key: 'pervomaiskyi_district',
        title: { UA: 'Первомайський', EN: 'Pervomaiskyi', RU: 'Первомайский' },
      },
      {
        key: 'snihurivskyi_district',
        title: { UA: 'Снігурівський', EN: 'Snihurivskyi', RU: 'Снигирёвский' },
      },
    ],
    cities: [
      {
        key: 'arbuzynka_town',
        title: { UA: 'Арбузинка', EN: 'Arbuzynka', RU: 'Арбузинка' },
        centerOf: 'arbuzynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bashtanka_city',
        title: { UA: 'Баштанка', EN: 'Bashtanka', RU: 'Баштанка' },
        centerOf: 'bashtanskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'berezanka_town',
        title: { UA: 'Березанка', EN: 'Berezanka', RU: 'Березанка' },
        centerOf: 'berezanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bereznehuvate_town',
        title: { UA: 'Березнегувате', EN: 'Bereznehuvate', RU: 'Березнеговатое' },
        centerOf: 'bereznehuvatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bratske_town',
        title: { UA: 'Братське', EN: 'Bratske', RU: 'Братск' },
        centerOf: 'bratskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'veselynove_town',
        title: { UA: 'Веселинове', EN: 'Veselynove', RU: 'Веселиново' },
        centerOf: 'veselynivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'voznesensk_city',
        title: { UA: 'Вознесенськ', EN: 'Voznesensk', RU: 'Вознесенск' },
        centerOf: 'voznesenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'vradiivka_town',
        title: { UA: 'Врадіївка', EN: 'Vradiivka', RU: 'Врадиевка' },
        centerOf: 'vradiivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'domanivka_town',
        title: { UA: 'Доманівка', EN: 'Domanivka', RU: 'Доманевка' },
        centerOf: 'domanivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yelanets_town',
        title: { UA: 'Єланець', EN: 'Yelanets', RU: 'Еланец' },
        centerOf: 'yelanetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kazanka_town',
        title: { UA: 'Казанка', EN: 'Kazanka', RU: 'Казанка' },
        centerOf: 'kazankivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kryve_ozero_town',
        title: { UA: 'Криве Озеро', EN: 'Kryve Ozero', RU: 'Кривое озеро' },
        centerOf: 'kryvoozerskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mykolaiv_city',
        title: { UA: 'Миколаїв', EN: 'Mykolaiv', RU: 'Николаев' },
        centerOf: 'mykolaivskyi_district',
        centerOf2: 'vitovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nova_odesa_city',
        title: { UA: 'Нова Одеса', EN: 'Nova Odesa', RU: 'Новая Одесса' },
        centerOf: 'novoodeskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novyi_buh_city',
        title: { UA: 'Новий Буг', EN: 'Novyi Buh', RU: 'Новый Буг' },
        centerOf: 'novobuzkyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'ochakiv_city',
        title: { UA: 'Очаків', EN: 'Ochakiv', RU: 'Очаков' },
        centerOf: 'ochakivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'pervomaisk_city',
        title: { UA: 'Первомайськ', EN: 'Pervomaisk', RU: 'Первомайск' },
        centerOf: 'pervomaiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'snihurivka_city',
        title: { UA: 'Снігурівка', EN: 'Snihurivka', RU: 'Снигиревка' },
        centerOf: 'snihurivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'yuzhnoukrainsk_city',
        title: { UA: 'Южноукраїнськ', EN: 'Yuzhnoukrainsk', RU: 'Южноукраинск' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'ODESSA_REGION',
    title: { UA: 'Одеська', EN: 'Odessa', RU: 'Одесская' },
    districts: [
      {
        key: 'ananivskyi_district',
        title: { UA: 'Ананьївський', EN: 'Ananivskyi', RU: 'Ананьевский' },
      },
      { key: 'artsyzkyi_district', title: { UA: 'Арцизький', EN: 'Artsyzkyi', RU: 'Арцизский' } },
      { key: 'baltskyi_district', title: { UA: 'Балтський', EN: 'Baltskyi', RU: 'Балтский' } },
      {
        key: 'berezivskyi_district',
        title: { UA: 'Березівський', EN: 'Berezivskyi', RU: 'Березовский' },
      },
      {
        key: 'bilhorod_dnistrovskyi_district',
        title: {
          UA: 'Білгород-Дністровський',
          EN: 'Bilhorod-Dnistrovskyi',
          RU: 'Белгород-Днестровский',
        },
      },
      {
        key: 'biliaivskyi_district',
        title: { UA: 'Біляївський', EN: 'Biliaivskyi', RU: 'Беляевский' },
      },
      {
        key: 'bolhradskyi_district',
        title: { UA: 'Болградський', EN: 'Bolhradskyi', RU: 'Болградский' },
      },
      {
        key: 'velykomykhailivskyi_district',
        title: { UA: 'Великомихайлівський', EN: 'Velykomykhailivskyi', RU: 'Великомихайловский' },
      },
      {
        key: 'zakharivskyi_district',
        title: { UA: 'Захарівський', EN: 'Zakharivskyi', RU: 'Захарьевский' },
      },
      {
        key: 'ivanivskyi_district',
        title: { UA: 'Іванівський', EN: 'Ivanivskyi', RU: 'Ивановский' },
      },
      {
        key: 'izmailskyi_district',
        title: { UA: 'Ізмаїльський', EN: 'Izmailskyi', RU: 'Измаильский' },
      },
      { key: 'kiliiskyi_district', title: { UA: 'Кілійський', EN: 'Kiliiskyi', RU: 'Килийский' } },
      { key: 'kodymskyi_district', title: { UA: 'Кодимський', EN: 'Kodymskyi', RU: 'Кодымский' } },
      { key: 'lymanskyi_district', title: { UA: 'Лиманський', EN: 'Lymanskyi', RU: 'Лиманский' } },
      {
        key: 'liubashivskyi_district',
        title: { UA: 'Любашівський', EN: 'Liubashivskyi', RU: 'Любашёвский' },
      },
      {
        key: 'mykolaivskyi_district',
        title: { UA: 'Миколаївський', EN: 'Mykolaivskyi', RU: 'Николаевский' },
      },
      {
        key: 'ovidiopolskyi_district',
        title: { UA: 'Овідіопольський', EN: 'Ovidiopolskyi', RU: 'Овидиопольский' },
      },
      {
        key: 'oknianskyi_district',
        title: { UA: 'Окнянський', EN: 'Oknianskyi', RU: 'Окнянский' },
      },
      {
        key: 'podilskyi_district',
        title: { UA: 'Подільський', EN: 'Podilskyi', RU: 'Подольский' },
      },
      { key: 'reniiskyi_district', title: { UA: 'Ренійський', EN: 'Reniiskyi', RU: 'Ренийский' } },
      {
        key: 'rozdilnianskyi_district',
        title: { UA: 'Роздільнянський', EN: 'Rozdilnianskyi', RU: 'Раздельнянский' },
      },
      {
        key: 'savranskyi_district',
        title: { UA: 'Савранський', EN: 'Savranskyi', RU: 'Савранский' },
      },
      { key: 'saratskyi_district', title: { UA: 'Саратський', EN: 'Saratskyi', RU: 'Саратский' } },
      {
        key: 'tarutynskyi_district',
        title: { UA: 'Тарутинський', EN: 'Tarutynskyi', RU: 'Тарутинский' },
      },
      {
        key: 'tatarbunarskyi_district',
        title: { UA: 'Татарбунарський', EN: 'Tatarbunarskyi', RU: 'Татарбунарский' },
      },
      {
        key: 'shyriaivskyi_district',
        title: { UA: 'Ширяївський', EN: 'Shyriaivskyi', RU: 'Ширяевский' },
      },
    ],
    cities: [
      {
        key: 'ananiv_city',
        title: { UA: 'Ананьїв', EN: 'Ananiv', RU: 'Ананьев' },
        centerOf: 'ananivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'artsyz_city',
        title: { UA: 'Арциз', EN: 'Artsyz', RU: 'Арциз' },
        centerOf: 'artsyzkyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'balta_city',
        title: { UA: 'Балта', EN: 'Balta', RU: 'Балта' },
        centerOf: 'baltskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'berezivka_city',
        title: { UA: 'Березівка', EN: 'Berezivka', RU: 'Березовка' },
        centerOf: 'berezivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bilhorod_dnistrovskyi_city',
        title: {
          UA: 'Білгород-Дністровський',
          EN: 'Bilhorod-Dnistrovskyi',
          RU: 'Белгород-Днестровский',
        },
        centerOf: 'bilhorod_dnistrovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'biliaivka_city',
        title: { UA: 'Біляївка', EN: 'Biliaivka', RU: 'Беляевка' },
        centerOf: 'biliaivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'bolhrad_city',
        title: { UA: 'Болград', EN: 'Bolhrad', RU: 'Болград' },
        centerOf: 'bolhradskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'velyka_mykhailivka_town',
        title: { UA: 'Велика Михайлівка', EN: 'Velyka Mykhailivka', RU: 'Великая Михайловка' },
        centerOf: 'velykomykhailivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'dobroslav_town',
        title: { UA: 'Доброслав', EN: 'Dobroslav', RU: 'Доброслав' },
        centerOf: 'lymanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zakharivka_town',
        title: { UA: 'Захарівка', EN: 'Zakharivka', RU: 'Захарьевка' },
        centerOf: 'zakharivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ivanivka_town',
        title: { UA: 'Іванівка', EN: 'Ivanivka', RU: 'Ивановка' },
        centerOf: 'ivanivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'izmail_city',
        title: { UA: 'Ізмаїл', EN: 'Izmail', RU: 'Измаил' },
        centerOf: 'izmailskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kiliia_city',
        title: { UA: 'Кілія', EN: 'Kiliia', RU: 'Килия' },
        centerOf: 'kiliiskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kodyma_city',
        title: { UA: 'Кодима', EN: 'Kodyma', RU: 'Кодыма' },
        centerOf: 'kodymskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'liubashivka_town',
        title: { UA: 'Любашівка', EN: 'Liubashivka', RU: 'Любашёвка' },
        centerOf: 'liubashivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mykolaivka_town',
        title: { UA: 'Миколаївка', EN: 'Mykolaivka', RU: 'Николаевка' },
        centerOf: 'mykolaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ovidiopol_town',
        title: { UA: 'Овідіополь', EN: 'Ovidiopol', RU: 'Овидиополь' },
        centerOf: 'ovidiopolskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'odesa_city',
        title: { UA: 'Одеса', EN: 'Odesa', RU: 'Одесса' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'okny_town',
        title: { UA: 'Окни', EN: 'Okny', RU: 'Окны' },
        centerOf: 'oknianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'podilsk_city',
        title: { UA: 'Подільськ', EN: 'Podilsk', RU: 'Подольск' },
        centerOf: 'podilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'reni_city',
        title: { UA: 'Рені', EN: 'Reni', RU: 'Рени' },
        centerOf: 'reniiskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rozdilna_city',
        title: { UA: 'Роздільна', EN: 'Rozdilna', RU: 'Раздельная' },
        centerOf: 'rozdilnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'savran_town',
        title: { UA: 'Саврань', EN: 'Savran', RU: 'Саврань' },
        centerOf: 'savranskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sarata_town',
        title: { UA: 'Сарата', EN: 'Sarata', RU: 'Сарата' },
        centerOf: 'saratskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tarutyne_town',
        title: { UA: 'Тарутине', EN: 'Tarutyne', RU: 'Тарутино' },
        centerOf: 'tarutynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'tatarbunary_city',
        title: { UA: 'Татарбунари', EN: 'Tatarbunary', RU: 'Татарбунары' },
        centerOf: 'tatarbunarskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'teplodar_city',
        title: { UA: 'Теплодар', EN: 'Teplodar', RU: 'Теплодар' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chornomorsk_city',
        title: { UA: 'Чорноморськ', EN: 'Chornomorsk', RU: 'Черноморск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'shyriaieve_town',
        title: { UA: 'Ширяєве', EN: 'Shyriaieve', RU: 'Ширяево' },
        centerOf: 'shyriaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'yuzhne_city',
        title: { UA: 'Южне', EN: 'Yuzhne', RU: 'Южное' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'POLTAVA_REGION',
    title: { UA: 'Полтавська область', EN: 'Poltava', RU: 'Полтавская' },
    districts: [
      {
        key: 'velykobahachanskyi_district',
        title: { UA: 'Великобагачанський', EN: 'Velykobahachanskyi', RU: 'Великобагачанский' },
      },
      { key: 'hadiatskyi_district', title: { UA: 'Гадяцький', EN: 'Hadiatskyi', RU: 'Гадячский' } },
      {
        key: 'hlobynskyi_district',
        title: { UA: 'Глобинський', EN: 'Hlobynskyi', RU: 'Глобинский' },
      },
      {
        key: 'hrebinkivskyi_district',
        title: { UA: 'Гребінківський', EN: 'Hrebinkivskyi', RU: 'Гребенковский' },
      },
      { key: 'dykanskyi_district', title: { UA: 'Диканський', EN: 'Dykanskyi', RU: 'Диканьский' } },
      {
        key: 'zinkivskyi_district',
        title: { UA: 'Зіньківський', EN: 'Zinkivskyi', RU: 'Зеньковский' },
      },
      {
        key: 'karlivskyi_district',
        title: { UA: 'Карлівський', EN: 'Karlivskyi', RU: 'Карловский' },
      },
      {
        key: 'kobeliatskyi_district',
        title: { UA: 'Кобеляцький', EN: 'Kobeliatskyi', RU: 'Кобелякский' },
      },
      {
        key: 'kozelshchynskyi_district',
        title: { UA: 'Козельщинський', EN: 'Kozelshchynskyi', RU: 'Козельщинский' },
      },
      {
        key: 'kotelevskyi_district',
        title: { UA: 'Котелевський', EN: 'Kotelevskyi', RU: 'Котелевский' },
      },
      {
        key: 'kremenchutskyi_district',
        title: { UA: 'Кременчуцький', EN: 'Kremenchutskyi', RU: 'Кременчугский' },
      },
      {
        key: 'lokhvytskyi_district',
        title: { UA: 'Лохвицький', EN: 'Lokhvytskyi', RU: 'Лохвицкий' },
      },
      { key: 'lubenskyi_district', title: { UA: 'Лубенський', EN: 'Lubenskyi', RU: 'Лубенский' } },
      {
        key: 'mashivskyi_district',
        title: { UA: 'Машівський', EN: 'Mashivskyi', RU: 'Машевский' },
      },
      {
        key: 'myrhorodskyi_district',
        title: { UA: 'Миргородський', EN: 'Myrhorodskyi', RU: 'Миргородский' },
      },
      {
        key: 'novosanzharskyi_district',
        title: { UA: 'Новосанжарський', EN: 'Novosanzharskyi', RU: 'Новосанжарский' },
      },
      { key: 'orzhytskyi_district', title: { UA: 'Оржицький', EN: 'Orzhytskyi', RU: 'Оржицкий' } },
      {
        key: 'pyriatynskyi_district',
        title: { UA: 'Пирятинський', EN: 'Pyriatynskyi', RU: 'Пирятинский' },
      },
      {
        key: 'poltavskyi_district',
        title: { UA: 'Полтавський', EN: 'Poltavskyi', RU: 'Полтавский' },
      },
      {
        key: 'reshetylivskyi_district',
        title: { UA: 'Решетилівський', EN: 'Reshetylivskyi', RU: 'Решетиловский' },
      },
      {
        key: 'semenivskyi_district',
        title: { UA: 'Семенівський', EN: 'Semenivskyi', RU: 'Семёновский' },
      },
      {
        key: 'khorolskyi_district',
        title: { UA: 'Хорольський', EN: 'Khorolskyi', RU: 'Хорольский' },
      },
      {
        key: 'chornukhynskyi_district',
        title: { UA: 'Чорнухинський', EN: 'Chornukhynskyi', RU: 'Чернухинский' },
      },
      {
        key: 'chutivskyi_district',
        title: { UA: 'Чутівський', EN: 'Chutivskyi', RU: 'Чутовский' },
      },
      {
        key: 'shyshatskyi_district',
        title: { UA: 'Шишацький', EN: 'Shyshatskyi', RU: 'Шишацкий' },
      },
    ],
    cities: [
      {
        key: 'velyka_bahachka_town',
        title: { UA: 'Велика Багачка', EN: 'Velyka Bahachka', RU: 'Великая Багачка' },
        centerOf: 'velykobahachanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'hadiach_city',
        title: { UA: 'Гадяч', EN: 'Hadiach', RU: 'Гадяч' },
        centerOf: 'hadiatskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'hlobyne_city',
        title: { UA: 'Глобине', EN: 'Hlobyne', RU: 'Глобино' },
        centerOf: 'hlobynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'horishni_plavni_city',
        title: { UA: 'Горішні Плавні', EN: 'Horishni Plavni', RU: 'Горишние Плавни' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'hrebinka_city',
        title: { UA: 'Гребінка', EN: 'Hrebinka', RU: 'Гребенка' },
        centerOf: 'hrebinkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'dykanka_town',
        title: { UA: 'Диканька', EN: 'Dykanka', RU: 'Диканька' },
        centerOf: 'dykanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zinkiv_city',
        title: { UA: 'Зіньків', EN: 'Zinkiv', RU: 'Зеньков' },
        centerOf: 'zinkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'karlivka_city',
        title: { UA: 'Карлівка', EN: 'Karlivka', RU: 'Карловка' },
        centerOf: 'karlivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kobeliaky_city',
        title: { UA: 'Кобеляки', EN: 'Kobeliaky', RU: 'Кобеляки' },
        centerOf: 'kobeliatskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kozelshchyna_town',
        title: { UA: 'Козельщина', EN: 'Kozelshchyna', RU: 'Козельщина' },
        centerOf: 'kozelshchynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kotelva_town',
        title: { UA: 'Котельва', EN: 'Kotelva', RU: 'Котельва' },
        centerOf: 'kotelevskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kremenchuk_city',
        title: { UA: 'Кременчук', EN: 'Kremenchuk', RU: 'Кременчуг' },
        centerOf: 'kremenchutskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lokhvytsia_city',
        title: { UA: 'Лохвиця', EN: 'Lokhvytsia', RU: 'Лохвица' },
        centerOf: 'lokhvytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lubny_city',
        title: { UA: 'Лубни', EN: 'Lubny', RU: 'Лубны' },
        centerOf: 'lubenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'mashivka_town',
        title: { UA: 'Машівка', EN: 'Mashivka', RU: 'Машевка' },
        centerOf: 'mashivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'myrhorod_city',
        title: { UA: 'Миргород', EN: 'Myrhorod', RU: 'Миргород' },
        centerOf: 'myrhorodskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'novi_sanzhary_town',
        title: { UA: 'Нові Санжари', EN: 'Novi Sanzhary', RU: 'Новые Санжары' },
        centerOf: 'novosanzharskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'orzhytsia_town',
        title: { UA: 'Оржиця', EN: 'Orzhytsia', RU: 'Оржица' },
        centerOf: 'orzhytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pyriatyn_city',
        title: { UA: 'Пирятин', EN: 'Pyriatyn', RU: 'Пирятин' },
        centerOf: 'pyriatynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'poltava_city',
        title: { UA: 'Полтава', EN: 'Poltava', RU: 'Полтава' },
        centerOf: 'poltavskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'reshetylivka_city',
        title: { UA: 'Решетилівка', EN: 'Reshetylivka', RU: 'Решетиловка' },
        centerOf: 'reshetylivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'semenivka_town',
        title: { UA: 'Семенівка', EN: 'Semenivka', RU: 'Семёновка' },
        centerOf: 'semenivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'khorol_city',
        title: { UA: 'Хорол', EN: 'Khorol', RU: 'Хорол' },
        centerOf: 'khorolskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'chornukhy_town',
        title: { UA: 'Чорнухи', EN: 'Chornukhy', RU: 'Чернухи' },
        centerOf: 'chornukhynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'chutove_town',
        title: { UA: 'Чутове', EN: 'Chutove', RU: 'Чутово' },
        centerOf: 'chutivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'shyshaky_town',
        title: { UA: 'Шишаки', EN: 'Shyshaky', RU: 'Шишаки' },
        centerOf: 'shyshatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'RIVNE_REGION',
    title: { UA: 'Рівненська', EN: 'Rivne', RU: 'Ровненская' },
    districts: [
      {
        key: 'bereznivskyi_district',
        title: { UA: 'Березнівський', EN: 'Bereznivskyi', RU: 'Березновский' },
      },
      {
        key: 'volodymyretskyi_district',
        title: { UA: 'Володимирецький', EN: 'Volodymyretskyi', RU: 'Владимирецкий' },
      },
      {
        key: 'hoshchanskyi_district',
        title: { UA: 'Гощанський', EN: 'Hoshchanskyi', RU: 'Гощанский' },
      },
      {
        key: 'demydivskyi_district',
        title: { UA: 'Демидівський', EN: 'Demydivskyi', RU: 'Демидовский' },
      },
      { key: 'dubenskyi_district', title: { UA: 'Дубенський', EN: 'Dubenskyi', RU: 'Дубенский' } },
      {
        key: 'dubrovytskyi_district',
        title: { UA: 'Дубровицький', EN: 'Dubrovytskyi', RU: 'Дубровицкий' },
      },
      {
        key: 'zarichnenskyi_district',
        title: { UA: 'Зарічненський', EN: 'Zarichnenskyi', RU: 'Заречненский' },
      },
      {
        key: 'zdolbunivskyi_district',
        title: { UA: 'Здолбунівський', EN: 'Zdolbunivskyi', RU: 'Здолбуновский' },
      },
      { key: 'koretskyi_district', title: { UA: 'Корецький', EN: 'Koretskyi', RU: 'Корецкий' } },
      {
        key: 'kostopilskyi_district',
        title: { UA: 'Костопільський', EN: 'Kostopilskyi', RU: 'Костопольский' },
      },
      {
        key: 'mlynivskyi_district',
        title: { UA: 'Млинівський', EN: 'Mlynivskyi', RU: 'Млиновский' },
      },
      { key: 'ostrozkyi_district', title: { UA: 'Острозький', EN: 'Ostrozkyi', RU: 'Острожский' } },
      {
        key: 'radyvylivskyi_district',
        title: { UA: 'Радивилівський', EN: 'Radyvylivskyi', RU: 'Радивиловский' },
      },
      {
        key: 'rivnenskyi_district',
        title: { UA: 'Рівненський', EN: 'Rivnenskyi', RU: 'Ровненский' },
      },
      {
        key: 'rokytnivskyi_district',
        title: { UA: 'Рокитнівський', EN: 'Rokytnivskyi', RU: 'Ракитневский' },
      },
      {
        key: 'sarnenskyi_district',
        title: { UA: 'Сарненський', EN: 'Sarnenskyi', RU: 'Сарненский' },
      },
    ],
    cities: [
      {
        key: 'berezne_city',
        title: { UA: 'Березне', EN: 'Berezne', RU: 'Березно' },
        centerOf: 'bereznivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'varash_city',
        title: { UA: 'Вараш', EN: 'Varash', RU: 'Вараш' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'volodymyrets_town',
        title: { UA: 'Володимирець', EN: 'Volodymyrets', RU: 'Владимирец' },
        centerOf: 'volodymyretskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'hoshcha_town',
        title: { UA: 'Гоща', EN: 'Hoshcha', RU: 'Гоща' },
        centerOf: 'hoshchanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'demydivka_town',
        title: { UA: 'Демидівка', EN: 'Demydivka', RU: 'Демидовка' },
        centerOf: 'demydivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'dubno_city',
        title: { UA: 'Дубно', EN: 'Dubno', RU: 'Дубно' },
        centerOf: 'dubenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'dubrovytsia_city',
        title: { UA: 'Дубровиця', EN: 'Dubrovytsia', RU: 'Дубровица' },
        centerOf: 'dubrovytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zarichne_town',
        title: { UA: 'Зарічне', EN: 'Zarichne', RU: 'Заречное' },
        centerOf: 'zarichnenskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zdolbuniv_city',
        title: { UA: 'Здолбунів', EN: 'Zdolbuniv', RU: 'Здолбунов' },
        centerOf: 'zdolbunivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'korets_city',
        title: { UA: 'Корець', EN: 'Korets', RU: 'Корец' },
        centerOf: 'koretskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kostopil_city',
        title: { UA: 'Костопіль', EN: 'Kostopil', RU: 'Костополь' },
        centerOf: 'kostopilskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'mlyniv_town',
        title: { UA: 'Млинів', EN: 'Mlyniv', RU: 'Млинов' },
        centerOf: 'mlynivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ostroh_city',
        title: { UA: 'Острог', EN: 'Ostroh', RU: 'Острог' },
        centerOf: 'ostrozkyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'radyvyliv_city',
        title: { UA: 'Радивилів', EN: 'Radyvyliv', RU: 'Радивилов' },
        centerOf: 'radyvylivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'rivne_city',
        title: { UA: 'Рівне', EN: 'Rivne', RU: 'Ровно' },
        centerOf: 'rivnenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'rokytne_town',
        title: { UA: 'Рокитне', EN: 'Rokytne', RU: 'Ракитное' },
        centerOf: 'rokytnivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sarny_city',
        title: { UA: 'Сарни', EN: 'Sarny', RU: 'Сарны' },
        centerOf: 'sarnenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'SUMY_REGION',
    title: { UA: 'Сумська', EN: 'Sumy', RU: 'Сумская' },
    districts: [
      {
        key: 'bilopilskyi_district',
        title: { UA: 'Білопільський', EN: 'Bilopilskyi', RU: 'Белопольский' },
      },
      { key: 'burynskyi_district', title: { UA: 'Буринський', EN: 'Burynskyi', RU: 'Бурынский' } },
      {
        key: 'velykopysarivskyi_district',
        title: { UA: 'Великописарівський', EN: 'Velykopysarivskyi', RU: 'Великописаревский' },
      },
      {
        key: 'hlukhivskyi_district',
        title: { UA: 'Глухівський', EN: 'Hlukhivskyi', RU: 'Глуховский' },
      },
      {
        key: 'konotopskyi_district',
        title: { UA: 'Конотопський', EN: 'Konotopskyi', RU: 'Конотопский' },
      },
      {
        key: 'krasnopilskyi_district',
        title: { UA: 'Краснопільський', EN: 'Krasnopilskyi', RU: 'Краснопольский' },
      },
      {
        key: 'krolevetskyi_district',
        title: { UA: 'Кролевецький', EN: 'Krolevetskyi', RU: 'Кролевецкий' },
      },
      {
        key: 'lebedynskyi_district',
        title: { UA: 'Лебединський', EN: 'Lebedynskyi', RU: 'Лебединский' },
      },
      {
        key: 'lypovodolynskyi_district',
        title: { UA: 'Липоводолинський', EN: 'Lypovodolynskyi', RU: 'Липоводолинский' },
      },
      {
        key: 'nedryhailivskyi_district',
        title: { UA: 'Недригайлівський', EN: 'Nedryhailivskyi', RU: 'Недригайловский' },
      },
      {
        key: 'okhtyrskyi_district',
        title: { UA: 'Охтирський', EN: 'Okhtyrskyi', RU: 'Ахтырский' },
      },
      {
        key: 'putyvlskyi_district',
        title: { UA: 'Путивльський', EN: 'Putyvlskyi', RU: 'Путивльский' },
      },
      { key: 'romenskyi_district', title: { UA: 'Роменський', EN: 'Romenskyi', RU: 'Роменский' } },
      {
        key: 'seredyno_budskyi_district',
        title: { UA: 'Середино-Будський', EN: 'Seredyno-Budskyi', RU: 'Середино-Будский' },
      },
      { key: 'sumskyi_district', title: { UA: 'Сумський', EN: 'Sumskyi', RU: 'Сумский' } },
      {
        key: 'trostianetskyi_district',
        title: { UA: 'Тростянецький', EN: 'Trostianetskyi', RU: 'Тростянецкий' },
      },
      {
        key: 'shostkynskyi_district',
        title: { UA: 'Шосткинський', EN: 'Shostkynskyi', RU: 'Шосткинский' },
      },
      {
        key: 'yampilskyi_district',
        title: { UA: 'Ямпільський', EN: 'Yampilskyi', RU: 'Ямпольский' },
      },
    ],
    cities: [
      {
        key: 'bilopillia_city',
        title: { UA: 'Білопілля', EN: 'Bilopillia', RU: 'Белополье' },
        centerOf: 'bilopilskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'buryn_city',
        title: { UA: 'Буринь', EN: 'Buryn', RU: 'Бурынь' },
        centerOf: 'burynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'velyka_pysarivka_town',
        title: { UA: 'Велика Писарівка', EN: 'Velyka Pysarivka', RU: 'Великая Писаревка' },
        centerOf: 'velykopysarivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'hlukhiv_city',
        title: { UA: 'Глухів', EN: 'Hlukhiv', RU: 'Глухов' },
        centerOf: 'hlukhivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'konotop_city',
        title: { UA: 'Конотоп', EN: 'Konotop', RU: 'Конотоп' },
        centerOf: 'konotopskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'krasnopillia_town',
        title: { UA: 'Краснопілля', EN: 'Krasnopillia', RU: 'Краснополье' },
        centerOf: 'krasnopilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'krolevets_city',
        title: { UA: 'Кролевець', EN: 'Krolevets', RU: 'Кролевец' },
        centerOf: 'krolevetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lebedyn_city',
        title: { UA: 'Лебедин', EN: 'Lebedyn', RU: 'Лебедин' },
        centerOf: 'lebedynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lypova_dolyna_town',
        title: { UA: 'Липова Долина', EN: 'Lypova Dolyna', RU: 'Липовая Долина' },
        centerOf: 'lypovodolynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'nedryhailiv_town',
        title: { UA: 'Недригайлів', EN: 'Nedryhailiv', RU: 'Недригайлов' },
        centerOf: 'nedryhailivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'okhtyrka_city',
        title: { UA: 'Охтирка', EN: 'Okhtyrka', RU: 'Ахтырка' },
        centerOf: 'okhtyrskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'putyvl_city',
        title: { UA: 'Путивль', EN: 'Putyvl', RU: 'Путивль' },
        centerOf: 'putyvlskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'romny_city',
        title: { UA: 'Ромни', EN: 'Romny', RU: 'Ромны' },
        centerOf: 'romenskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'seredyna_buda_city',
        title: { UA: 'Середина-Буда', EN: 'Seredyna-Buda', RU: 'Середина-Буда' },
        centerOf: 'seredyno_budskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'sumy_city',
        title: { UA: 'Суми', EN: 'Sumy', RU: 'Сумы' },
        centerOf: 'sumskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'trostianets_city',
        title: { UA: 'Тростянець', EN: 'Trostianets', RU: 'Тростянец' },
        centerOf: 'trostianetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'shostka_city',
        title: { UA: 'Шостка', EN: 'Shostka', RU: 'Шостка' },
        centerOf: 'shostkynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yampil_town',
        title: { UA: 'Ямпіль', EN: 'Yampil', RU: 'Ямполь' },
        centerOf: 'yampilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'TERNOPIL_REGION',
    title: { UA: 'Тернопільська', EN: 'Ternopil', RU: 'Тернопольская' },
    districts: [
      {
        key: 'berezhanskyi_district',
        title: { UA: 'Бережанський', EN: 'Berezhanskyi', RU: 'Бережанский' },
      },
      {
        key: 'borshchivskyi_district',
        title: { UA: 'Борщівський', EN: 'Borshchivskyi', RU: 'Борщёвский' },
      },
      { key: 'buchatskyi_district', title: { UA: 'Бучацький', EN: 'Buchatskyi', RU: 'Бучачский' } },
      {
        key: 'husiatynskyi_district',
        title: { UA: 'Гусятинський', EN: 'Husiatynskyi', RU: 'Гусятинский' },
      },
      {
        key: 'zalishchytskyi_district',
        title: { UA: 'Заліщицький', EN: 'Zalishchytskyi', RU: 'Залещицкий' },
      },
      { key: 'zbarazkyi_district', title: { UA: 'Збаразький', EN: 'Zbarazkyi', RU: 'Збаражский' } },
      {
        key: 'zborivskyi_district',
        title: { UA: 'Зборівський', EN: 'Zborivskyi', RU: 'Зборовский' },
      },
      { key: 'kozivskyi_district', title: { UA: 'Козівський', EN: 'Kozivskyi', RU: 'Козовский' } },
      {
        key: 'kremenetskyi_district',
        title: { UA: 'Кременецький', EN: 'Kremenetskyi', RU: 'Кременецкий' },
      },
      {
        key: 'lanovetskyi_district',
        title: { UA: 'Лановецький', EN: 'Lanovetskyi', RU: 'Лановецкий' },
      },
      {
        key: 'monastyryskyi_district',
        title: { UA: 'Монастириський', EN: 'Monastyryskyi', RU: 'Монастырисский' },
      },
      {
        key: 'pidvolochyskyi_district',
        title: { UA: 'Підволочиський', EN: 'Pidvolochyskyi', RU: 'Подволочисский' },
      },
      {
        key: 'pidhaietskyi_district',
        title: { UA: 'Підгаєцький', EN: 'Pidhaietskyi', RU: 'Подгаецкий' },
      },
      {
        key: 'terebovlianskyi_district',
        title: { UA: 'Теребовлянський', EN: 'Terebovlianskyi', RU: 'Теребовлянский' },
      },
      {
        key: 'ternopilskyi_district',
        title: { UA: 'Тернопільський', EN: 'Ternopilskyi', RU: 'Тернопольский' },
      },
      {
        key: 'chortkivskyi_district',
        title: { UA: 'Чортківський', EN: 'Chortkivskyi', RU: 'Чортковский' },
      },
      { key: 'shumskyi_district', title: { UA: 'Шумський', EN: 'Shumskyi', RU: 'Шумский' } },
    ],
    cities: [
      {
        key: 'berezhany_city',
        title: { UA: 'Бережани', EN: 'Berezhany', RU: 'Бережаны' },
        centerOf: 'berezhanskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'borshchiv_city',
        title: { UA: 'Борщів', EN: 'Borshchiv', RU: 'Борщев' },
        centerOf: 'borshchivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'buchach_city',
        title: { UA: 'Бучач', EN: 'Buchach', RU: 'Бучач' },
        centerOf: 'buchatskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'husiatyn_town',
        title: { UA: 'Гусятин', EN: 'Husiatyn', RU: 'Гусятин' },
        centerOf: 'husiatynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zalishchyky_city',
        title: { UA: 'Заліщики', EN: 'Zalishchyky', RU: 'Залещики' },
        centerOf: 'zalishchytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zbarazh_city',
        title: { UA: 'Збараж', EN: 'Zbarazh', RU: 'Збараж' },
        centerOf: 'zbarazkyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zboriv_city',
        title: { UA: 'Зборів', EN: 'Zboriv', RU: 'Зборов' },
        centerOf: 'zborivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kozova_town',
        title: { UA: 'Козова', EN: 'Kozova', RU: 'Козова' },
        centerOf: 'kozivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kremenets_city',
        title: { UA: 'Кременець', EN: 'Kremenets', RU: 'Кременец' },
        centerOf: 'kremenetskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lanivtsi_city',
        title: { UA: 'Ланівці', EN: 'Lanivtsi', RU: 'Лановцы' },
        centerOf: 'lanovetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'monastyryska_city',
        title: { UA: 'Монастириська', EN: 'Monastyryska', RU: 'Монастыриска' },
        centerOf: 'monastyryskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'pidvolochysk_town',
        title: { UA: 'Підволочиськ', EN: 'Pidvolochysk', RU: 'Подволочиск' },
        centerOf: 'pidvolochyskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pidhaitsi_city',
        title: { UA: 'Підгайці', EN: 'Pidhaitsi', RU: 'Подгайцы' },
        centerOf: 'pidhaietskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'terebovlia_city',
        title: { UA: 'Теребовля', EN: 'Terebovlia', RU: 'Теребовля' },
        centerOf: 'terebovlianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'ternopil_city',
        title: { UA: 'Тернопіль', EN: 'Ternopil', RU: 'Тернополь' },
        centerOf: 'ternopilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chortkiv_city',
        title: { UA: 'Чортків', EN: 'Chortkiv', RU: 'Чортков' },
        centerOf: 'chortkivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'shumsk_city',
        title: { UA: 'Шумськ', EN: 'Shumsk', RU: 'Шумск' },
        centerOf: 'shumskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'KHARKIV_REGION',
    title: { UA: 'Харківська', EN: 'Kharkiv', RU: 'Харьковская' },
    districts: [
      {
        key: 'balakliiskyi_district',
        title: { UA: 'Балаклійський', EN: 'Balakliiskyi', RU: 'Балаклейский' },
      },
      {
        key: 'barvinkivskyi_district',
        title: { UA: 'Барвінківський', EN: 'Barvinkivskyi', RU: 'Барвенковский' },
      },
      {
        key: 'blyzniukivskyi_district',
        title: { UA: 'Близнюківський', EN: 'Blyzniukivskyi', RU: 'Близнюковский' },
      },
      {
        key: 'bohodukhivskyi_district',
        title: { UA: 'Богодухівський', EN: 'Bohodukhivskyi', RU: 'Богодуховский' },
      },
      { key: 'borivskyi_district', title: { UA: 'Борівський', EN: 'Borivskyi', RU: 'Боровский' } },
      {
        key: 'valkivskyi_district',
        title: { UA: 'Валківський', EN: 'Valkivskyi', RU: 'Валковский' },
      },
      {
        key: 'velykoburlutskyi_district',
        title: { UA: 'Великобурлуцький', EN: 'Velykoburlutskyi', RU: 'Великобурлукский' },
      },
      {
        key: 'vovchanskyi_district',
        title: { UA: 'Вовчанський', EN: 'Vovchanskyi', RU: 'Волчанский' },
      },
      {
        key: 'dvorichanskyi_district',
        title: { UA: 'Дворічанський', EN: 'Dvorichanskyi', RU: 'Двуречанский' },
      },
      {
        key: 'derhachivskyi_district',
        title: { UA: 'Дергачівський', EN: 'Derhachivskyi', RU: 'Дергачёвский' },
      },
      {
        key: 'zachepylivskyi_district',
        title: { UA: 'Зачепилівський', EN: 'Zachepylivskyi', RU: 'Зачепиловский' },
      },
      { key: 'zmiivskyi_district', title: { UA: 'Зміївський', EN: 'Zmiivskyi', RU: 'Змиевской' } },
      {
        key: 'zolochivskyi_district',
        title: { UA: 'Золочівський', EN: 'Zolochivskyi', RU: 'Золочевский' },
      },
      { key: 'iziumskyi_district', title: { UA: 'Ізюмський', EN: 'Iziumskyi', RU: 'Изюмский' } },
      {
        key: 'kehychivskyi_district',
        title: { UA: 'Кегичівський', EN: 'Kehychivskyi', RU: 'Кегичевский' },
      },
      {
        key: 'kolomatskyi_district',
        title: { UA: 'Коломацький', EN: 'Kolomatskyi', RU: 'Коломакский' },
      },
      {
        key: 'krasnohradskyi_district',
        title: { UA: 'Красноградський', EN: 'Krasnohradskyi', RU: 'Красноградский' },
      },
      {
        key: 'krasnokutskyi_district',
        title: { UA: 'Краснокутський', EN: 'Krasnokutskyi', RU: 'Краснокутский' },
      },
      {
        key: 'kupianskyi_district',
        title: { UA: "Куп'янський", EN: 'Kupianskyi', RU: 'Купянский' },
      },
      { key: 'lozivskyi_district', title: { UA: 'Лозівський', EN: 'Lozivskyi', RU: 'Лозовский' } },
      {
        key: 'novovodolazkyi_district',
        title: { UA: 'Нововодолазький', EN: 'Novovodolazkyi', RU: 'Нововодолажский' },
      },
      {
        key: 'pervomaiskyi_district',
        title: { UA: 'Первомайський', EN: 'Pervomaiskyi', RU: 'Первомайский' },
      },
      {
        key: 'pechenizkyi_district',
        title: { UA: 'Печенізький', EN: 'Pechenizkyi', RU: 'Печенежский' },
      },
      {
        key: 'sakhnovshchynskyi_district',
        title: { UA: 'Сахновщинський', EN: 'Sakhnovshchynskyi', RU: 'Сахновщинский' },
      },
      {
        key: 'kharkivskyi_district',
        title: { UA: 'Харківський', EN: 'Kharkivskyi', RU: 'Харьковский' },
      },
      {
        key: 'chuhuivskyi_district',
        title: { UA: 'Чугуївський', EN: 'Chuhuivskyi', RU: 'Чугуевский' },
      },
      {
        key: 'shevchenkivskyi_district',
        title: { UA: 'Шевченківський', EN: 'Shevchenkivskyi', RU: 'Шевченковский' },
      },
    ],
    cities: [
      {
        key: 'balakliia_city',
        title: { UA: 'Балаклія', EN: 'Balakliia', RU: 'Балаклея' },
        centerOf: 'balakliiskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'barvinkove_city',
        title: { UA: 'Барвінкове', EN: 'Barvinkove', RU: 'Барвенково' },
        centerOf: 'barvinkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'blyzniuky_town',
        title: { UA: 'Близнюки', EN: 'Blyzniuky', RU: 'Близнюки' },
        centerOf: 'blyzniukivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'bohodukhiv_city',
        title: { UA: 'Богодухів', EN: 'Bohodukhiv', RU: 'Богодухов' },
        centerOf: 'bohodukhivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'borova_town',
        title: { UA: 'Борова', EN: 'Borova', RU: 'Боровая' },
        centerOf: 'borivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'valky_city',
        title: { UA: 'Валки', EN: 'Valky', RU: 'Валки' },
        centerOf: 'valkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'velykyi_burluk_town',
        title: { UA: 'Великий Бурлук', EN: 'Velykyi Burluk', RU: 'Великий Бурлук' },
        centerOf: 'velykoburlutskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vovchansk_city',
        title: { UA: 'Вовчанськ', EN: 'Vovchansk', RU: 'Волчанск' },
        centerOf: 'vovchanskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'dvorichna_town',
        title: { UA: 'Дворічна', EN: 'Dvorichna', RU: 'Двуречная' },
        centerOf: 'dvorichanskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'derhachi_city',
        title: { UA: 'Дергачі', EN: 'Derhachi', RU: 'Дергачи' },
        centerOf: 'derhachivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zachepylivka_town',
        title: { UA: 'Зачепилівка', EN: 'Zachepylivka', RU: 'Зачепиловка' },
        centerOf: 'zachepylivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zmiiv_city',
        title: { UA: 'Зміїв', EN: 'Zmiiv', RU: 'Змиёв' },
        centerOf: 'zmiivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zolochiv_town',
        title: { UA: 'Золочів', EN: 'Zolochiv', RU: 'Золочев' },
        centerOf: 'zolochivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'izium_city',
        title: { UA: 'Ізюм', EN: 'Izium', RU: 'Изюм' },
        centerOf: 'iziumskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kehychivka_town',
        title: { UA: 'Кегичівка', EN: 'Kehychivka', RU: 'Кегичевка' },
        centerOf: 'kehychivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kolomak_town',
        title: { UA: 'Коломак', EN: 'Kolomak', RU: 'Коломак' },
        centerOf: 'kolomatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'krasnohrad_city',
        title: { UA: 'Красноград', EN: 'Krasnohrad', RU: 'Красноград' },
        centerOf: 'krasnohradskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'krasnokutsk_town',
        title: { UA: 'Краснокутськ', EN: 'Krasnokutsk', RU: 'Краснокутск' },
        centerOf: 'krasnokutskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kupiansk_city',
        title: { UA: "Куп'янськ", EN: 'Kupiansk', RU: 'Купянск' },
        centerOf: 'kupianskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'lozova_city',
        title: { UA: 'Лозова', EN: 'Lozova', RU: 'Лозовая' },
        centerOf: 'lozivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'liubotyn_city',
        title: { UA: 'Люботин', EN: 'Liubotyn', RU: 'Люботин' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nova_vodolaha_town',
        title: { UA: 'Нова Водолага', EN: 'Nova Vodolaha', RU: 'Новая Водолага' },
        centerOf: 'novovodolazkyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'pervomaiskyi_city',
        title: { UA: 'Первомайський', EN: 'Pervomaiskyi', RU: 'Первомайский' },
        centerOf: 'pervomaiskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'pechenihy_town',
        title: { UA: 'Печеніги', EN: 'Pechenihy', RU: 'Печенеги' },
        centerOf: 'pechenizkyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sakhnovshchyna_town',
        title: { UA: 'Сахновщина', EN: 'Sakhnovshchyna', RU: 'Сахновщина' },
        centerOf: 'sakhnovshchynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kharkiv_city',
        title: { UA: 'Харків', EN: 'Kharkiv', RU: 'Харьков' },
        centerOf: 'kharkivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chuhuiv_city',
        title: { UA: 'Чугуїв', EN: 'Chuhuiv', RU: 'Чугуев' },
        centerOf: 'chuhuivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'shevchenkove_town',
        title: { UA: 'Шевченкове', EN: 'Shevchenkove', RU: 'Шевченково' },
        centerOf: 'shevchenkivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'KHERSON_REGION',
    title: { UA: 'Херсонська', EN: 'Kherson', RU: 'Херсонская' },
    districts: [
      {
        key: 'beryslavskyi_district',
        title: { UA: 'Бериславський', EN: 'Beryslavskyi', RU: 'Бериславский' },
      },
      {
        key: 'bilozerskyi_district',
        title: { UA: 'Білозерський', EN: 'Bilozerskyi', RU: 'Белозёрский' },
      },
      {
        key: 'velykolepetyskyi_district',
        title: { UA: 'Великолепетиський', EN: 'Velykolepetyskyi', RU: 'Великолепетихский' },
      },
      {
        key: 'velykooleksandrivskyi_district',
        title: {
          UA: 'Великоолександрівський',
          EN: 'Velykooleksandrivskyi',
          RU: 'Великоалександровский',
        },
      },
      {
        key: 'verkhnorohachytskyi_district',
        title: { UA: 'Верхньорогачицький', EN: 'Verkhnorohachytskyi', RU: 'Верхнерогачикский' },
      },
      {
        key: 'vysokopilskyi_district',
        title: { UA: 'Високопільський', EN: 'Vysokopilskyi', RU: 'Высокопольский' },
      },
      {
        key: 'henicheskyi_district',
        title: { UA: 'Генічеський', EN: 'Henicheskyi', RU: 'Генический' },
      },
      {
        key: 'holoprystanskyi_district',
        title: { UA: 'Голопристанський', EN: 'Holoprystanskyi', RU: 'Голопристанский' },
      },
      {
        key: 'hornostaivskyi_district',
        title: { UA: 'Горностаївський', EN: 'Hornostaivskyi', RU: 'Горностаевский' },
      },
      {
        key: 'ivanivskyi_district',
        title: { UA: 'Іванівський', EN: 'Ivanivskyi', RU: 'Ивановский' },
      },
      {
        key: 'kalanchatskyi_district',
        title: { UA: 'Каланчацький', EN: 'Kalanchatskyi', RU: 'Каланчакский' },
      },
      {
        key: 'kakhovskyi_district',
        title: { UA: 'Каховський', EN: 'Kakhovskyi', RU: 'Каховский' },
      },
      {
        key: 'nyzhnosirohozkyi_district',
        title: { UA: 'Нижньосірогозький', EN: 'Nyzhnosirohozkyi', RU: 'Нижнесерогозский' },
      },
      {
        key: 'novovorontsovskyi_district',
        title: { UA: 'Нововоронцовський', EN: 'Novovorontsovskyi', RU: 'Нововоронцовский' },
      },
      {
        key: 'novotroitskyi_district',
        title: { UA: 'Новотроїцький', EN: 'Novotroitskyi', RU: 'Новотроицкий' },
      },
      {
        key: 'oleshkivskyi_district',
        title: { UA: 'Олешківський', EN: 'Oleshkivskyi', RU: 'Алёшковский' },
      },
      {
        key: 'skadovskyi_district',
        title: { UA: 'Скадовський', EN: 'Skadovskyi', RU: 'Скадовский' },
      },
      {
        key: 'chaplynskyi_district',
        title: { UA: 'Чаплинський', EN: 'Chaplynskyi', RU: 'Чаплинский' },
      },
    ],
    cities: [
      {
        key: 'beryslav_city',
        title: { UA: 'Берислав', EN: 'Beryslav', RU: 'Берислав' },
        centerOf: 'beryslavskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bilozerka_town',
        title: { UA: 'Білозерка', EN: 'Bilozerka', RU: 'Белозерка' },
        centerOf: 'bilozerskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'velyka_lepetykha_town',
        title: { UA: 'Велика Лепетиха', EN: 'Velyka Lepetykha', RU: 'Великая Лепетиха' },
        centerOf: 'velykolepetyskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'velyka_oleksandrivka_town',
        title: {
          UA: 'Велика Олександрівка',
          EN: 'Velyka Oleksandrivka',
          RU: 'Великая Александровка',
        },
        centerOf: 'velykooleksandrivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'verkhnii_rohachyk_town',
        title: { UA: 'Верхній Рогачик', EN: 'Verkhnii Rohachyk', RU: 'Верхний Рогачик' },
        centerOf: 'verkhnorohachytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vysokopillia_town',
        title: { UA: 'Високопілля', EN: 'Vysokopillia', RU: 'Высокополье' },
        centerOf: 'vysokopilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'henichesk_city',
        title: { UA: 'Генічеськ', EN: 'Henichesk', RU: 'Геническ' },
        centerOf: 'henicheskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'hola_prystan_city',
        title: { UA: 'Гола Пристань', EN: 'Hola Prystan', RU: 'Голая Пристань' },
        centerOf: 'holoprystanskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'hornostaivka_town',
        title: { UA: 'Горностаївка', EN: 'Hornostaivka', RU: 'Горностаевка' },
        centerOf: 'hornostaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'ivanivka_town',
        title: { UA: 'Іванівка', EN: 'Ivanivka', RU: 'Ивановка' },
        centerOf: 'ivanivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kalanchak_town',
        title: { UA: 'Каланчак', EN: 'Kalanchak', RU: 'Каланчак' },
        centerOf: 'kalanchatskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kakhovka_city',
        title: { UA: 'Каховка', EN: 'Kakhovka', RU: 'Каховка' },
        centerOf: 'kakhovskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nyzhni_sirohozy_town',
        title: { UA: 'Нижні Сірогози', EN: 'Nyzhni Sirohozy', RU: 'Нижние Серогозы' },
        centerOf: 'nyzhnosirohozkyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'nova_kakhovka_city',
        title: { UA: 'Нова Каховка', EN: 'Nova Kakhovka', RU: 'Новая Каховка' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'novovorontsovka_town',
        title: { UA: 'Нововоронцовка', EN: 'Novovorontsovka', RU: 'Нововоронцовка' },
        centerOf: 'novovorontsovskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'novotroitske_town',
        title: { UA: 'Новотроїцьке', EN: 'Novotroitske', RU: 'Новотроицкое' },
        centerOf: 'novotroitskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'oleshky_city',
        title: { UA: 'Олешки', EN: 'Oleshky', RU: 'Алёшки' },
        centerOf: 'oleshkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'skadovsk_city',
        title: { UA: 'Скадовск', EN: 'Skadovsk', RU: 'Скадовск' },
        centerOf: 'skadovskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kherson_city',
        title: { UA: 'Херсон', EN: 'Kherson', RU: 'Херсон' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chaplynka_town',
        title: { UA: 'Чаплинка', EN: 'Chaplynka', RU: 'Чаплынка' },
        centerOf: 'chaplynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'KHMELNYTSKYI_REGION',
    title: { UA: 'Хмельницька', EN: 'Khmelnytskyi', RU: 'Хмельницкая' },
    districts: [
      {
        key: 'bilohirskyi_district',
        title: { UA: 'Білогірський', EN: 'Bilohirskyi', RU: 'Белогорский' },
      },
      {
        key: 'vinkovetskyi_district',
        title: { UA: 'Віньковецький', EN: 'Vinkovetskyi', RU: 'Виньковецкий' },
      },
      {
        key: 'volochyskyi_district',
        title: { UA: 'Волочиський', EN: 'Volochyskyi', RU: 'Волочисский' },
      },
      {
        key: 'horodotskyi_district',
        title: { UA: 'Городоцький', EN: 'Horodotskyi', RU: 'Городокский' },
      },
      {
        key: 'derazhnianskyi_district',
        title: { UA: 'Деражнянський', EN: 'Derazhnianskyi', RU: 'Деражнянский' },
      },
      {
        key: 'dunaievetskyi_district',
        title: { UA: 'Дунаєвецький', EN: 'Dunaievetskyi', RU: 'Дунаевецкий' },
      },
      {
        key: 'iziaslavskyi_district',
        title: { UA: 'Ізяславський', EN: 'Iziaslavskyi', RU: 'Изяславский' },
      },
      {
        key: 'kamianets_podilskyi_district',
        title: { UA: "Кам'янець-Подільський", EN: 'Kamianets-Podilskyi', RU: 'Каменец-Подольский' },
      },
      {
        key: 'krasylivskyi_district',
        title: { UA: 'Красилівський', EN: 'Krasylivskyi', RU: 'Красиловский' },
      },
      {
        key: 'letychivskyi_district',
        title: { UA: 'Летичівський', EN: 'Letychivskyi', RU: 'Летичевский' },
      },
      {
        key: 'novoushytskyi_district',
        title: { UA: 'Новоушицький', EN: 'Novoushytskyi', RU: 'Новоушицкий' },
      },
      { key: 'polonskyi_district', title: { UA: 'Полонський', EN: 'Polonskyi', RU: 'Полонский' } },
      {
        key: 'slavutskyi_district',
        title: { UA: 'Славутський', EN: 'Slavutskyi', RU: 'Славутский' },
      },
      {
        key: 'starokostiantynivskyi_district',
        title: {
          UA: 'Старокостянтинівський',
          EN: 'Starokostiantynivskyi',
          RU: 'Староконстантиновский',
        },
      },
      {
        key: 'starosyniavskyi_district',
        title: { UA: 'Старосинявський', EN: 'Starosyniavskyi', RU: 'Старосинявский' },
      },
      {
        key: 'teofipolskyi_district',
        title: { UA: 'Теофіпольський', EN: 'Teofipolskyi', RU: 'Теофипольский' },
      },
      {
        key: 'khmelnytskyi_district',
        title: { UA: 'Хмельницький', EN: 'Khmelnytskyi', RU: 'Хмельницкий' },
      },
      {
        key: 'chemerovetskyi_district',
        title: { UA: 'Чемеровецький', EN: 'Chemerovetskyi', RU: 'Чемеровецкий' },
      },
      {
        key: 'shepetivskyi_district',
        title: { UA: 'Шепетівський', EN: 'Shepetivskyi', RU: 'Шепетовский' },
      },
      {
        key: 'yarmolynetskyi_district',
        title: { UA: 'Ярмолинецький', EN: 'Yarmolynetskyi', RU: 'Ярмолинецкий' },
      },
    ],
    cities: [
      {
        key: 'bilohiria_town',
        title: { UA: "Білогір'я", EN: 'Bilohiria', RU: 'Белогорье' },
        centerOf: 'bilohirskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'vinkivtsi_town',
        title: { UA: 'Віньківці', EN: 'Vinkivtsi', RU: 'Виньковцы' },
        centerOf: 'vinkovetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'volochysk_city',
        title: { UA: 'Волочиськ', EN: 'Volochysk', RU: 'Волочиск' },
        centerOf: 'volochyskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'horodok_city',
        title: { UA: 'Городок', EN: 'Horodok', RU: 'Городок' },
        centerOf: 'horodotskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'derazhnia_city',
        title: { UA: 'Деражня', EN: 'Derazhnia', RU: 'Деражня' },
        centerOf: 'derazhnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'dunaivtsi_city',
        title: { UA: 'Дунаївці', EN: 'Dunaivtsi', RU: 'Дунаевцы' },
        centerOf: 'dunaievetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'iziaslav_city',
        title: { UA: 'Ізяслав', EN: 'Iziaslav', RU: 'Изяслав' },
        centerOf: 'iziaslavskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kamianets_podilskyi_city',
        title: { UA: "Кам'янець-Подільський", EN: 'Kamianets-Podilskyi', RU: 'Каменец-Подольский' },
        centerOf: 'kamianets_podilskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'krasyliv_city',
        title: { UA: 'Красилів', EN: 'Krasyliv', RU: 'Красилов' },
        centerOf: 'krasylivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'letychiv_town',
        title: { UA: 'Летичів', EN: 'Letychiv', RU: 'Летичев' },
        centerOf: 'letychivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'netishyn_city',
        title: { UA: 'Нетішин', EN: 'Netishyn', RU: 'Нетешин' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nova_ushytsia_town',
        title: { UA: 'Нова Ушиця', EN: 'Nova Ushytsia', RU: 'Новая Ушица' },
        centerOf: 'novoushytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'polonne_city',
        title: { UA: 'Полонне', EN: 'Polonne', RU: 'Полонное' },
        centerOf: 'polonskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'slavuta_city',
        title: { UA: 'Славута', EN: 'Slavuta', RU: 'Славута' },
        centerOf: 'slavutskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'stara_syniava_town',
        title: { UA: 'Стара Синява', EN: 'Stara Syniava', RU: 'Старая Синява' },
        centerOf: 'starosyniavskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'starokostiantyniv_city',
        title: { UA: 'Старокостянтинів', EN: 'Starokostiantyniv', RU: 'Староконстантинов' },
        centerOf: 'starokostiantynivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'teofipol_town',
        title: { UA: 'Теофіполь', EN: 'Teofipol', RU: 'Теофиполь' },
        centerOf: 'teofipolskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'khmelnytskyi_city',
        title: { UA: 'Хмельницький', EN: 'Khmelnytskyi', RU: 'Хмельницкий' },
        centerOf: 'khmelnytskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chemerivtsi_town',
        title: { UA: 'Чемерівці', EN: 'Chemerivtsi', RU: 'Чемеровцы' },
        centerOf: 'chemerovetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'shepetivka_city',
        title: { UA: 'Шепетівка', EN: 'Shepetivka', RU: 'Шепетовка' },
        centerOf: 'shepetivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'yarmolyntsi_town',
        title: { UA: 'Ярмолинці', EN: 'Yarmolyntsi', RU: 'Ярмолинцы' },
        centerOf: 'yarmolynetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
    ],
  },
  {
    key: 'CHERKASY_REGION',
    title: { UA: 'Черкаська', EN: 'Cherkasy', RU: 'Черкасская' },
    districts: [
      {
        key: 'horodyshchenskyi_district',
        title: { UA: 'Городищенський', EN: 'Horodyshchenskyi', RU: 'Городищенский' },
      },
      {
        key: 'drabivskyi_district',
        title: { UA: 'Драбівський', EN: 'Drabivskyi', RU: 'Драбовский' },
      },
      {
        key: 'zhashkivskyi_district',
        title: { UA: 'Жашківський', EN: 'Zhashkivskyi', RU: 'Жашковский' },
      },
      {
        key: 'zvenyhorodskyi_district',
        title: { UA: 'Звенигородський', EN: 'Zvenyhorodskyi', RU: 'Звенигородский' },
      },
      {
        key: 'zolotoniskyi_district',
        title: { UA: 'Золотоніський', EN: 'Zolotoniskyi', RU: 'Золотоношский' },
      },
      {
        key: 'kamianskyi_district',
        title: { UA: "Кам'янський", EN: 'Kamianskyi', RU: 'Каменский' },
      },
      { key: 'kanivskyi_district', title: { UA: 'Канівський', EN: 'Kanivskyi', RU: 'Каневский' } },
      {
        key: 'katerynopilskyi_district',
        title: { UA: 'Катеринопільський', EN: 'Katerynopilskyi', RU: 'Катеринопольский' },
      },
      {
        key: 'korsun_shevchenkivskyi_district',
        title: {
          UA: 'Корсунь-Шевченківський',
          EN: 'Korsun-Shevchenkivskyi',
          RU: 'Корсунь-Шевченковский',
        },
      },
      {
        key: 'lysianskyi_district',
        title: { UA: 'Лисянський', EN: 'Lysianskyi', RU: 'Лысянский' },
      },
      {
        key: 'mankivskyi_district',
        title: { UA: 'Маньківський', EN: 'Mankivskyi', RU: 'Маньковский' },
      },
      {
        key: 'monastyryshchenskyi_district',
        title: { UA: 'Монастирищенський', EN: 'Monastyryshchenskyi', RU: 'Монастырищенский' },
      },
      {
        key: 'smilianskyi_district',
        title: { UA: 'Смілянський', EN: 'Smilianskyi', RU: 'Смелянский' },
      },
      {
        key: 'talnivskyi_district',
        title: { UA: 'Тальнівський', EN: 'Talnivskyi', RU: 'Тальновский' },
      },
      { key: 'umanskyi_district', title: { UA: 'Уманський', EN: 'Umanskyi', RU: 'Уманский' } },
      {
        key: 'khrystynivskyi_district',
        title: { UA: 'Христинівський', EN: 'Khrystynivskyi', RU: 'Христиновский' },
      },
      {
        key: 'cherkaskyi_district',
        title: { UA: 'Черкаський', EN: 'Cherkaskyi', RU: 'Черкасский' },
      },
      {
        key: 'chyhyrynskyi_district',
        title: { UA: 'Чигиринський', EN: 'Chyhyrynskyi', RU: 'Чигиринский' },
      },
      {
        key: 'chornobaivskyi_district',
        title: { UA: 'Чорнобаївський', EN: 'Chornobaivskyi', RU: 'Чернобаевский' },
      },
      {
        key: 'shpolianskyi_district',
        title: { UA: 'Шполянський', EN: 'Shpolianskyi', RU: 'Шполянский' },
      },
    ],
    cities: [
      {
        key: 'vatutine_city',
        title: { UA: 'Ватутіне', EN: 'Vatutine', RU: 'Ватутино' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'horodyshche_city',
        title: { UA: 'Городище', EN: 'Horodyshche', RU: 'Городище' },
        centerOf: 'horodyshchenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'drabiv_town',
        title: { UA: 'Драбів', EN: 'Drabiv', RU: 'Драбов' },
        centerOf: 'drabivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zhashkiv_city',
        title: { UA: 'Жашків', EN: 'Zhashkiv', RU: 'Жашков' },
        centerOf: 'zhashkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zvenyhorodka_city',
        title: { UA: 'Звенигородка', EN: 'Zvenyhorodka', RU: 'Звенигородка' },
        centerOf: 'zvenyhorodskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'zolotonosha_city',
        title: { UA: 'Золотоноша', EN: 'Zolotonosha', RU: 'Золотоноша' },
        centerOf: 'zolotoniskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'kamianka_city',
        title: { UA: "Кам'янка", EN: 'Kamianka', RU: 'Каменка' },
        centerOf: 'kamianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kaniv_city',
        title: { UA: 'Канів', EN: 'Kaniv', RU: 'Канев' },
        centerOf: 'kanivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'katerynopil_town',
        title: { UA: 'Катеринопіль', EN: 'Katerynopil', RU: 'Катеринополь' },
        centerOf: 'katerynopilskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'korsun_shevchenkivskyi_city',
        title: {
          UA: 'Корсунь-Шевченківський',
          EN: 'Korsun-Shevchenkivskyi',
          RU: 'Корсунь-Шевченковский',
        },
        centerOf: 'korsun_shevchenkivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'lysianka_town',
        title: { UA: 'Лисянка', EN: 'Lysianka', RU: 'Лысянка' },
        centerOf: 'lysianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mankivka_town',
        title: { UA: 'Маньківка', EN: 'Mankivka', RU: 'Маньковка' },
        centerOf: 'mankivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'monastyryshche_city',
        title: { UA: 'Монастирище', EN: 'Monastyryshche', RU: 'Монастырище' },
        centerOf: 'monastyryshchenskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'smila_city',
        title: { UA: 'Сміла', EN: 'Smila', RU: 'Смела' },
        centerOf: 'smilianskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'talne_city',
        title: { UA: 'Тальне', EN: 'Talne', RU: 'Тальное' },
        centerOf: 'talnivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'uman_city',
        title: { UA: 'Умань', EN: 'Uman', RU: 'Умань' },
        centerOf: 'umanskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'khrystynivka_city',
        title: { UA: 'Христинівка', EN: 'Khrystynivka', RU: 'Христиновка' },
        centerOf: 'khrystynivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'cherkasy_city',
        title: { UA: 'Черкаси', EN: 'Cherkasy', RU: 'Черкассы' },
        centerOf: 'cherkaskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'chyhyryn_city',
        title: { UA: 'Чигирин', EN: 'Chyhyryn', RU: 'Чигирин' },
        centerOf: 'chyhyrynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'chornobai_town',
        title: { UA: 'Чорнобай', EN: 'Chornobai', RU: 'Чернобай' },
        centerOf: 'chornobaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'shpola_city',
        title: { UA: 'Шпола', EN: 'Shpola', RU: 'Шпола' },
        centerOf: 'shpolianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
    ],
  },
  {
    key: 'CHERNIVTSI_REGION',
    title: { UA: 'Чернівецька', EN: 'Chernivtsi', RU: 'Черновицкая' },
    districts: [
      {
        key: 'vyzhnytskyi_district',
        title: { UA: 'Вижницький', EN: 'Vyzhnytskyi', RU: 'Вижницкий' },
      },
      {
        key: 'hertsaivskyi_district',
        title: { UA: 'Герцаївський', EN: 'Hertsaivskyi', RU: 'Герцаевский' },
      },
      {
        key: 'hlybotskyi_district',
        title: { UA: 'Глибоцький', EN: 'Hlybotskyi', RU: 'Глыбокский' },
      },
      {
        key: 'zastavnivskyi_district',
        title: { UA: 'Заставнівський', EN: 'Zastavnivskyi', RU: 'Заставновский' },
      },
      {
        key: 'kelmenetskyi_district',
        title: { UA: 'Кельменецький', EN: 'Kelmenetskyi', RU: 'Кельменецкий' },
      },
      {
        key: 'kitsmanskyi_district',
        title: { UA: 'Кіцманський', EN: 'Kitsmanskyi', RU: 'Кицманский' },
      },
      {
        key: 'novoselytskyi_district',
        title: { UA: 'Новоселицький', EN: 'Novoselytskyi', RU: 'Новоселицкий' },
      },
      {
        key: 'putylskyi_district',
        title: { UA: 'Путильський', EN: 'Putylskyi', RU: 'Путильский' },
      },
      {
        key: 'sokyrianskyi_district',
        title: { UA: 'Сокирянський', EN: 'Sokyrianskyi', RU: 'Сокирянский' },
      },
      {
        key: 'storozhynetskyi_district',
        title: { UA: 'Сторожинецький', EN: 'Storozhynetskyi', RU: 'Сторожинецкий' },
      },
      {
        key: 'khotynskyi_district',
        title: { UA: 'Хотинський', EN: 'Khotynskyi', RU: 'Хотинский' },
      },
    ],
    cities: [
      {
        key: 'vyzhnytsia_city',
        title: { UA: 'Вижниця', EN: 'Vyzhnytsia', RU: 'Вижница' },
        centerOf: 'vyzhnytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'hertsa_city',
        title: { UA: 'Герца', EN: 'Hertsa', RU: 'Герца' },
        centerOf: 'hertsaivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'hlyboka_town',
        title: { UA: 'Глибока', EN: 'Hlyboka', RU: 'Глыбокая' },
        centerOf: 'hlybotskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'zastavna_city',
        title: { UA: 'Заставна', EN: 'Zastavna', RU: 'Заставна' },
        centerOf: 'zastavnivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kelmentsi_town',
        title: { UA: 'Кельменці', EN: 'Kelmentsi', RU: 'Кельменцы' },
        centerOf: 'kelmenetskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'kitsman_city',
        title: { UA: 'Кіцмань', EN: 'Kitsman', RU: 'Кицмань' },
        centerOf: 'kitsmanskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'novodnistrovsk_city',
        title: { UA: 'Новодністровськ', EN: 'Novodnistrovsk', RU: 'Новоднестровск' },
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'novoselytsya_city',
        title: { UA: 'Новоселиця', EN: 'Novoselytsya', RU: 'Новоселица' },
        centerOf: 'novoselytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'putyla_town',
        title: { UA: 'Путила', EN: 'Putyla', RU: 'Путила' },
        centerOf: 'putylskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sokyriany_city',
        title: { UA: 'Сокиряни', EN: 'Sokyriany', RU: 'Сокиряны' },
        centerOf: 'sokyrianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'storozhynets_city',
        title: { UA: 'Сторожинець', EN: 'Storozhynets', RU: 'Сторожинец' },
        centerOf: 'storozhynetskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'khotyn_city',
        title: { UA: 'Хотин', EN: 'Khotyn', RU: 'Хотин' },
        centerOf: 'khotynskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'chernivtsi_city',
        title: { UA: 'Чернівці', EN: 'Chernivtsi', RU: 'Черновцы' },
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
  {
    key: 'CHERNIHIV_REGION',
    title: { UA: 'Чернігівська', EN: 'Chernihiv', RU: 'Черниговская' },
    districts: [
      {
        key: 'bakhmatskyi_district',
        title: { UA: 'Бахмацький', EN: 'Bakhmatskyi', RU: 'Бахмачский' },
      },
      {
        key: 'bobrovytskyi_district',
        title: { UA: 'Бобровицький', EN: 'Bobrovytskyi', RU: 'Бобровицкий' },
      },
      {
        key: 'borznianskyi_district',
        title: { UA: 'Борзнянський', EN: 'Borznianskyi', RU: 'Борзнянский' },
      },
      {
        key: 'varvynskyi_district',
        title: { UA: 'Варвинський', EN: 'Varvynskyi', RU: 'Варвинский' },
      },
      {
        key: 'horodnianskyi_district',
        title: { UA: 'Городнянський', EN: 'Horodnianskyi', RU: 'Городнянский' },
      },
      {
        key: 'ichnianskyi_district',
        title: { UA: 'Ічнянський', EN: 'Ichnianskyi', RU: 'Ичнянский' },
      },
      {
        key: 'kozeletskyi_district',
        title: { UA: 'Козелецький', EN: 'Kozeletskyi', RU: 'Козелецкий' },
      },
      { key: 'koropskyi_district', title: { UA: 'Коропський', EN: 'Koropskyi', RU: 'Коропский' } },
      {
        key: 'koriukivskyi_district',
        title: { UA: 'Корюківський', EN: 'Koriukivskyi', RU: 'Корюковский' },
      },
      {
        key: 'kulykivskyi_district',
        title: { UA: 'Куликівський', EN: 'Kulykivskyi', RU: 'Куликовский' },
      },
      { key: 'menskyi_district', title: { UA: 'Менський', EN: 'Menskyi', RU: 'Менский' } },
      {
        key: 'nizhynskyi_district',
        title: { UA: 'Ніжинський', EN: 'Nizhynskyi', RU: 'Нежинский' },
      },
      {
        key: 'novhorod_siverskyi_district',
        title: { UA: 'Новгород-Сіверський', EN: 'Novhorod-Siverskyi', RU: 'Новгород-Северский' },
      },
      { key: 'nosivskyi_district', title: { UA: 'Носівський', EN: 'Nosivskyi', RU: 'Носовский' } },
      {
        key: 'prylutskyi_district',
        title: { UA: 'Прилуцький', EN: 'Prylutskyi', RU: 'Прилукский' },
      },
      {
        key: 'ripkynskyi_district',
        title: { UA: 'Ріпкинський', EN: 'Ripkynskyi', RU: 'Репкинский' },
      },
      {
        key: 'semenivskyi_district',
        title: { UA: 'Семенівський', EN: 'Semenivskyi', RU: 'Семёновский' },
      },
      { key: 'snovskyi_district', title: { UA: 'Сновський', EN: 'Snovskyi', RU: 'Сновский' } },
      {
        key: 'sosnytskyi_district',
        title: { UA: 'Сосницький', EN: 'Sosnytskyi', RU: 'Сосницкий' },
      },
      {
        key: 'sribnianskyi_district',
        title: { UA: 'Срібнянський', EN: 'Sribnianskyi', RU: 'Сребнянский' },
      },
      {
        key: 'talalaivskyi_district',
        title: { UA: 'Талалаївський', EN: 'Talalaivskyi', RU: 'Талалаевский' },
      },
      {
        key: 'chernihivskyi_district',
        title: { UA: 'Чернігівський', EN: 'Chernihivskyi', RU: 'Черниговский' },
      },
    ],
    cities: [
      {
        key: 'bakhmach_city',
        title: { UA: 'Бахмач', EN: 'Bakhmach', RU: 'Бахмач' },
        centerOf: 'bakhmatskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'bobrovytsia_city',
        title: { UA: 'Бобровиця', EN: 'Bobrovytsia', RU: 'Бобровица' },
        centerOf: 'bobrovytskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'borzna_city',
        title: { UA: 'Борзна', EN: 'Borzna', RU: 'Борзна' },
        centerOf: 'borznianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'varva_town',
        title: { UA: 'Варва', EN: 'Varva', RU: 'Варва' },
        centerOf: 'varvynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'horodnia_city',
        title: { UA: 'Городня', EN: 'Horodnia', RU: 'Городня' },
        centerOf: 'horodnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'ichnia_city',
        title: { UA: 'Ічня', EN: 'Ichnia', RU: 'Ичня' },
        centerOf: 'ichnianskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kozelets_town',
        title: { UA: 'Козелець', EN: 'Kozelets', RU: 'Козелец' },
        centerOf: 'kozeletskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'korop_town',
        title: { UA: 'Короп', EN: 'Korop', RU: 'Короп' },
        centerOf: 'koropskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'koriukivka_city',
        title: { UA: 'Корюківка', EN: 'Koriukivka', RU: 'Корюковка' },
        centerOf: 'koriukivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'kulykivka_town',
        title: { UA: 'Куликівка', EN: 'Kulykivka', RU: 'Куликовка' },
        centerOf: 'kulykivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'mena_city',
        title: { UA: 'Мена', EN: 'Mena', RU: 'Мена' },
        centerOf: 'menskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'nizhyn_city',
        title: { UA: 'Ніжин', EN: 'Nizhyn', RU: 'Нежин' },
        centerOf: 'nizhynskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'novhorod_siverskyi_city',
        title: { UA: 'Новгород-Сіверський', EN: 'Novhorod-Siverskyi', RU: 'Новгород-Северский' },
        centerOf: 'novhorod_siverskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'nosivka_city',
        title: { UA: 'Носівка', EN: 'Nosivka', RU: 'Носовка' },
        centerOf: 'nosivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'pryluky_city',
        title: { UA: 'Прилуки', EN: 'Pryluky', RU: 'Прилуки' },
        centerOf: 'prylutskyi_district',
        type: CityType.REGIONAL_CITY,
      },
      {
        key: 'ripky_town',
        title: { UA: 'Ріпки', EN: 'Ripky', RU: 'Репки' },
        centerOf: 'ripkynskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'semenivka_city',
        title: { UA: 'Семенівка', EN: 'Semenivka', RU: 'Семёновка' },
        centerOf: 'semenivskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'snovsk_city',
        title: { UA: 'Сновськ', EN: 'Snovsk', RU: 'Сновск' },
        centerOf: 'snovskyi_district',
        type: CityType.DISTRICT_CITY,
      },
      {
        key: 'sosnytsia_town',
        title: { UA: 'Сосниця', EN: 'Sosnytsia', RU: 'Сосница' },
        centerOf: 'sosnytskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'sribne_town',
        title: { UA: 'Срібне', EN: 'Sribne', RU: 'Сребное' },
        centerOf: 'sribnianskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'talalaivka_town',
        title: { UA: 'Талалаївка', EN: 'Talalaivka', RU: 'Талалаевка' },
        centerOf: 'talalaivskyi_district',
        type: CityType.DISTRICT_TOWN,
      },
      {
        key: 'chernihiv_city',
        title: { UA: 'Чернігів', EN: 'Chernihiv', RU: 'Чернигов' },
        centerOf: 'chernihivskyi_district',
        type: CityType.REGIONAL_CITY,
      },
    ],
  },
]
