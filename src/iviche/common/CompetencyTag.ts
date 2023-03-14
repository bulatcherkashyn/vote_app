type Langs = {
  UA: string
  EN: string
  RU: string
}

export type CompetencyTag = {
  key: string
  title: Langs
  subTags?: Array<CompetencyTag>
  email?: string
  isDeprecated?: boolean
}

export const competencyTagsList: Array<CompetencyTag> = [
  {
    key: 'LEGISLATURE',
    title: {
      UA: 'Законодавча влада',
      EN: 'Legislature',
      RU: 'Законодательская власть',
    },
    subTags: [
      {
        key: 'DEPUTY_FACTIONS_OR_GROUPS',
        title: {
          UA: 'Депутатські фракції/групи',
          EN: 'Deputy fractions/groups',
          RU: 'Депутатские фракции/группы',
        },
        subTags: [
          {
            key: 'FRACTION_SERVANT_OF_THE_PEOPLE',
            title: {
              UA: 'Фракція "СЛУГА НАРОДУ"',
              EN: 'Faction "SERVANT OF THE PEOPLE"',
              RU: 'Фракция "СЛУГА НАРОДА"',
            },
            email: 'info@sluga-narodu.com',
          },
          {
            key: 'FRACTION_OPPOSITION_PLATFORM_FOR_LIFE',
            title: {
              UA: 'Фракція "ОПОЗИЦІЙНА ПЛАТФОРМА - ЗА ЖИТТЯ"',
              EN: 'Faction "OPPOSITION PLATFORM - FOR LIFE"',
              RU: 'Фракция "ОППОЗИЦИОННАЯ ПЛАТФОРМА - ЗА ЖИЗНЬ"',
            },
            email: 'zazhittya2016@gmail.com',
          },
          {
            key: 'FRACTION_FATHERLAND',
            title: {
              UA: 'Фракція ВО "БАТЬКІВЩИНА"',
              EN: 'Fraction "FATHERLAND"',
              RU: 'Фракция ВО "БАТЬКИВЩИНА"',
            },
            email: 'pr@ba.org.ua',
          },
          {
            key: 'FRACTION_EUROPEAN_SOLIDARITY',
            title: {
              UA: 'Фракція "ЄВРОПЕЙСЬКА СОЛІДАРНІСТЬ"',
              EN: 'Faction "EUROPEAN SOLIDARITY"',
              RU: 'Фракция "ЕВРОПЕЙСКАЯ СОЛИДАРНОСТЬ"',
            },
            email: 'info@solydarnist.org',
          },
          {
            key: 'FRACTION_VOICE',
            title: {
              UA: 'Фракція "ГОЛОС"',
              EN: 'Faction "VOICE"',
              RU: 'Фракция "ГОЛОС"',
            },
            email: 'info@goloszmin.org',
          },
          {
            key: 'FRACTION_DOVIRA',
            title: {
              UA: 'Депутатська група "ДОВІРА"',
              EN: 'Fraction "DOVIRA"',
              RU: 'Депутатская группа "ДОВЕРИЕ"',
            },
            email: 'dovira@rada.gov.ua',
          },
        ],
      },
      {
        key: 'STANDING_PARLIAMENTARY_COMMITTEES',
        title: {
          UA: 'Постійні парламентські комітети',
          EN: 'Standing parliamentary committees',
          RU: 'Постоянные парламентские комитеты',
        },
        subTags: [
          {
            key: 'VERKHOVNA_RADA_COMMITTEE_ON_AGRARIAN_AND_LAND_POLICY',
            title: {
              UA: 'Комітет Верховної Ради з питань аграрної та земельної політики',
              EN: 'Verkhovna Rada Committee on Agrarian and Land Policy',
              RU: 'Комитет Верховной Рады по вопросам аграрной и земельной политики',
            },
            email: 'starynets@rada.gov.ua',
          },
          {
            key: 'VERKHOVNA_RADA_OF_UKRAINE_COMMITTEE_ON_ANTICORRUPTION_POLICY',
            title: {
              UA: 'Комітет Верховної Ради України з питань антикорупційної політики',
              EN: 'Verkhovna Rada of Ukraine Committee on Anti-Corruption Policy',
              RU: 'Комитет Верховной Рады Украины по вопросам антикоррупционной политики',
            },
            email: 'sorochyk@v.rada.gov.ua',
          },
          {
            key: 'BUDGET_COMMITTEE',
            title: {
              UA: 'Комітет з питань бюджету',
              EN: 'Budget Committee',
              RU: 'Комитет по вопросам бюджета',
            },
            email: 'tsabal@rada.gov.ua',
          },
          {
            key: 'HUMANITARIAN_AND_INFORMATION_POLICY_COMMITTEE',
            title: {
              UA: 'Комітет з питань гуманітарної та інформаційної політики',
              EN: 'Humanitarian and Information Policy Committee',
              RU: 'Комитет по вопросам гуманитарной и информационной политики',
            },
            email: 'k_kult@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_ENVIRONMENTAL_POLICY_AND_NATURE_MANAGEMENT',
            title: {
              UA: 'Комітет з питань екологічної політики та природокористування',
              EN: 'Committee on Environmental Policy and Nature Management',
              RU: 'Комитет по вопросам экологической политики и природопользования',
            },
            email: 'bondarenko@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_ECONOMIC_DEVELOPMENT',
            title: {
              UA: 'Комітет з питань економічного розвитку',
              EN: 'Committee on Economic Development',
              RU: 'Комитет по вопросам экономического развития',
            },
            email: 'gavryliv@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_ENERGY_AND_HOUSING_AND_COMMUNAL_SERVICES',
            title: {
              UA: 'Комітет з питань енергетики та житлово-комунальних послуг',
              EN: 'Committee on Energy and Housing and Communal Services',
              RU: 'Комитет по вопросам энергетики и жилищно-коммунальных услуг',
            },
            email: 'secretariat-PEK@v.rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_NATION_HEALTH_AND_MEDICAL_CARE_AND_HEALTH_INSURANCE',
            title: {
              UA: "Комітет з питань здоров'я нації, медичної допомоги та медичного страхування",
              EN: 'Committee on Nation Health, Medical Care and Health Insurance',
              RU:
                'Комитет по вопросам здоровья нации, медицинской помощи и медицинского страхования',
            },
            email: 'radutskyy@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_FOREIGN_POLICY_AND_INTERPARLIAMENTARY_COOPERATION',
            title: {
              UA: 'Комітет з питань зовнішньої політики та міжпарламентського співробітництва',
              EN: 'Committee on Foreign Policy and Interparliamentary Cooperation',
              RU: 'Комитет по вопросам внешней политики и межпарламентского сотрудничества',
            },
            email: 'merezhko@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_UKRAINES_INTEGRATION_WITH_THE_EUROPEAN_UNION',
            title: {
              UA: 'Комітет з питань інтеграції України з Європейським Союзом',
              EN: "Committee on Ukraine's Integration with the European Union",
              RU: 'Комитет по вопросам интеграции Украины с Европейским Союзом',
            },
            email: 'comeuroint@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_YOUTH_AND_SPORTS',
            title: {
              UA: 'Комітет з питань молоді і спорту',
              EN: 'Committee on Youth and Sports',
              RU: 'Комитет по вопросам молодежи и спорта',
            },
            email: 'skalozub@rada.gov.ua',
          },
          {
            key: 'NATIONAL_SECURITY_AND_DEFENSE_AND_INTELLIGENCE_COMMITTEE',
            title: {
              UA: 'Комітет з питань національної безпеки, оборони та розвідки',
              EN: 'National Security, Defense and Intelligence Committee',
              RU: 'Комитет по вопросам национальной безопасности, обороны и разведки',
            },
            email: 'komnbor@rada.gov.ua',
          },
          {
            key:
              'COMMITTEE_ON_THE_ORGANIZATION_OF_STATE_POWER_AND_LOCAL_SELFGOVERNMENT_AND_REGIONAL_DEVELOPMENT_AND_URBAN_PLANNING',
            title: {
              UA:
                'Комітет з питань організації державної влади, місцевого самоврядування, регіонального розвитку та містобудування',
              EN:
                'Committee on the Organization of State Power, Local Self-Government, Regional Development and Urban Planning',
              RU:
                'Комитет по вопросам организации государственной власти, местного самоуправления, регионального развития и градостроительства',
            },
            email: 'anzhela.maliuha@v.rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_EDUCATION_AND_SCIENCE_AND_INNOVATION',
            title: {
              UA: 'Комітет з питань освіти, науки та інновацій',
              EN: 'Committee on Education, Science and Innovation',
              RU: 'Комитет по вопросам образования, науки и инноваций',
            },
            email: 'kno@rada.gov.ua',
          },
          {
            key:
              'COMMITTEE_ON_HUMAN_RIGHTS_AND_DEOCCUPATION_AND_REINTEGRATION_OF_THE_TEMPORARILY_OCCUPIED_TERRITORIES_IN_DONETSK_AND_LUHANSK_OBLASTS_AND_THE_AUTONOMOUS_REPUBLIC_OF_CRIMEA_AND_THE_CITY_OF_SEVASTOPOL_AND_NATIONAL_MINORITIES_AND_INTERNATIONAL_RELATIONS',
            title: {
              UA:
                'Комітет з питань прав людини, деокупації та реінтеграції тимчасово окупованих територій у Донецькій, Луганській областях та Автономної Республіки Крим, міста Севастополя, національних меншин і міжнаціональних відносин',
              EN:
                'Committee on Human Rights, Deoccupation and Reintegration of the Temporarily Occupied Territories in Donetsk, Luhansk Oblasts and the Autonomous Republic of Crimea, the City of Sevastopol, National Minorities and International Relations',
              RU:
                'Комитет по правам человека, деоккупации и реинтеграции временно оккупированных территорий в Донецкой, Луганской областях и Автономной Республике Крым, города Севастополь, национальных меньшинств и межнациональных отношений',
            },
            email: 'chihrin@rada.gov.ua',
          },
          {
            key: 'LEGAL_POLICY_COMMITTEE',
            title: {
              UA: 'Комітет з питань правової політики',
              EN: 'Legal Policy Committee',
              RU: 'Комитет по вопросам правовой политики',
            },
            email: 'k_prav_pol@rada.gov.ua',
          },
          {
            key: 'LAW_ENFORCEMENT_COMMITTEE',
            title: {
              UA: 'Комітет з питань правоохоронної діяльності',
              EN: 'Law Enforcement Committee',
              RU: 'Комитет по вопросам правоохранительной деятельности',
            },
            email: 'drapyatyi@v.rada.gov.ua',
          },
          {
            key:
              'COMMITTEE_ON_RULES_OF_PROCEDURE_AND_DEPUTY_ETHICS_AND_ORGANIZATION_OF_WORK_OF_THE_VERKHOVNA_RADA_OF_UKRAINE',
            title: {
              UA:
                'Комітет з питань Регламенту, депутатської етики та організації роботи Верховної Ради України',
              EN:
                'Committee on Rules of Procedure, Deputy Ethics and Organization of Work of the Verkhovna Rada of Ukraine',
              RU:
                'Комитет по вопросам Регламента, депутатской этики и организации работы Верховной Рады Украины',
            },
            email: 'puziychuk@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_FREEDOM_OF_SPEECH',
            title: {
              UA: 'Комітет з питань свободи слова',
              EN: 'Committee on Freedom of Speech',
              RU: 'Комитет по вопросам свободы слова',
            },
            email: 'kozlov-m@v.rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_SOCIAL_POLICY_AND_PROTECTION_OF_VETERANS_RIGHTS',
            title: {
              UA: 'Комітет з питань соціальної політики та захисту прав ветеранів',
              EN: "Committee on Social Policy and Protection of Veterans' Rights",
              RU: 'Комитет по вопросам социальной политики и защиты прав ветеранов',
            },
            email: 'prianishnikova@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_TRANSPORT_AND_INFRASTRUCTURE',
            title: {
              UA: 'Комітет з питань транспорту та інфраструктури',
              EN: 'Committee on Transport and Infrastructure',
              RU: 'Комитет по вопросам транспорта и инфраструктуры',
            },
            email: 'lukina@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_FINANCE_AND_TAX_AND_CUSTOMS_POLICY',
            title: {
              UA: 'Комітет з питань фінансів, податкової та митної політики',
              EN: 'Committee on Finance, Tax and Customs Policy',
              RU: 'Комитет по вопросам финансов, налоговой и таможенной политики',
            },
            email: 'pryjma@rada.gov.ua',
          },
          {
            key: 'COMMITTEE_ON_DIGITAL_TRANSFORMATION',
            title: {
              UA: 'Комітет з питань цифрової трансформації',
              EN: 'Committee on Digital Transformation',
              RU: 'Комитет по вопросам цифровой трансформации',
            },
            email: 'stolyarska@v.rada.gov.ua',
          },
        ],
      },
    ],
  },
  {
    key: 'EXECUTIVE',
    title: {
      UA: 'Виконавча влада',
      EN: 'Executive',
      RU: 'Исполнительная власть',
    },
    subTags: [
      {
        key: 'MINISTRY',
        title: {
          UA: 'Міністерства',
          EN: 'Ministry',
          RU: 'Министерства',
        },
        subTags: [
          {
            key: 'OFFICE_OF_REFORMS_OF_THE_CABINET_OF_MINISTERS_OF_UKRAINE',
            title: {
              UA: 'Офіс реформ Кабінету Міністрів України',
              EN: 'Office of Reforms of the Cabinet of Ministers of Ukraine',
              RU: 'Офис реформ Кабинета Министров Украины',
            },
            email: 'yashchenko@kmu.gov.ua',
          },
          {
            key: 'MINISTRY_OF_ENERGY_OF_UKRAINE',
            title: {
              UA: 'Міністерство енергетики України',
              EN: 'Ministry of Energy of Ukraine',
              RU: 'Министерство энергетики Украины',
            },
            email: 'kanc@mev.gov.ua',
          },
          {
            key: 'MINISTRY_OF_REINTEGRATION_OF_THE_TEMPORARILY_OCCUPIED_TERRITORIES',
            title: {
              UA: 'Міністерство з питань реінтеграції тимчасово окупованих територій',
              EN: 'Ministry of Reintegration of the Temporarily Occupied Territories',
              RU: 'Министерство по вопросам реинтеграции временно оккупированных территорий',
            },
            email: 'press@mtot.gov.ua',
          },
          {
            key: 'MINISTRY_OF_YOUTH_AND_SPORTS_OF_UKRAINE',
            title: {
              UA: 'Міністерство молоді та спорту України',
              EN: 'Ministry of Youth and Sports of Ukraine',
              RU: 'Министерство молодежи и спорта Украины',
            },
            email: 'press@msms.gov.ua',
          },
          {
            key: 'MINISTRY_OF_DIGITAL_TRANSFORMATION_OF_UKRAINE',
            title: {
              UA: 'Міністерство цифрової трансформації України',
              EN: 'Ministry of Digital Transformation of Ukraine',
              RU: 'Министерство цифровой трансформации Украины',
            },
            email: 'hello@thedigital.gov.ua',
          },
          {
            key: 'MINISTRY_OF_ECONOMIC_DEVELOPMENT_AND_TRADE_AND_AGRICULTURE_OF_UKRAINE',
            title: {
              UA: 'Міністерство розвитку економіки, торгівлі та сільського господарства України',
              EN: 'Ministry of Economic Development, Trade and Agriculture of Ukraine',
              RU: 'Министерство развития экономики, торговли и сельского хозяйства Украины',
            },
            email: 'meconomy@me.gov.ua',
          },
          {
            key: 'MINISTRY_OF_INTERNAL_AFFAIRS_OF_UKRAINE',
            title: {
              UA: 'Міністерство внутрішніх справ України',
              EN: 'Ministry of Internal Affairs of Ukraine',
              RU: 'Министерство внутренних дел Украины',
            },
            email: 'zmi@mvs.gov.ua',
          },
          {
            key: 'MINISTRY_OF_ENVIRONMENTAL_PROTECTION_AND_NATURAL_RESOURCES_OF_UKRAINE',
            title: {
              UA: 'Міністерство захисту довкілля та природних ресурсів України',
              EN: 'Ministry of Environmental Protection and Natural Resources of Ukraine',
              RU: 'Министерство защиты окружающей среды и природных ресурсов Украины',
            },
            email: 'gr_priem@menr.gov.ua',
          },
          {
            key: 'MINISTRY_OF_FOREIGN_AFFAIRS_OF_UKRAINE',
            title: {
              UA: 'Міністерство закордонних справ України',
              EN: 'Ministry of Foreign Affairs of Ukraine',
              RU: 'Министерство иностранных дел Украины',
            },
            email: 'zsmfa@mfa.gov.ua',
          },
          {
            key: 'MINISTRY_OF_INFRASTRUCTURE_OF_UKRAINE',
            title: {
              UA: 'Міністерство інфраструктури України',
              EN: 'Ministry of Infrastructure of Ukraine',
              RU: 'Министерство инфраструктуры Украины',
            },
            email: 'press@mtu.gov.ua',
          },
          {
            key: 'MINISTRY_OF_CULTURE_AND_INFORMATION_POLICY_OF_UKRAINE',
            title: {
              UA: 'Міністерство культури та інформаційної політики України',
              EN: 'Ministry of Culture and Information Policy of Ukraine',
              RU: 'Министерство культуры и информационной политики Украины',
            },
            email: 'zvernennya@mkip.gov.ua',
          },
          {
            key: 'MINISTRY_OF_DEFENCE_UKRAINE',
            title: {
              UA: 'Міністерство оборони України',
              EN: 'Ministry of Defence Ukraine',
              RU: 'Министерство обороны Украины',
            },
            email: 'admou@mil.gov.ua,',
          },
          {
            key: 'MINISTRY_OF_EDUCATION_AND_SCIENCE_OF_UKRAINE',
            title: {
              UA: 'Міністерство освіти і науки України',
              EN: 'Ministry of Education and Science of Ukraine',
              RU: 'Министерство образования и науки Украины',
            },
            email: 'ez@mon.gov.ua',
          },
          {
            key: 'MINISTRY_OF_HEALTH_OF_UKRAINE',
            title: {
              UA: "Міністерство охорони здоров'я України",
              EN: 'Ministry of Health of Ukraine',
              RU: 'Министерство здравоохранения Украины',
            },
            email: 'moz@moz.gov.ua',
          },
          {
            key: 'MINISTRY_OF_DEVELOPMENT_OF_COMMUNITIES_AND_TERRITORIES_OF_UKRAINE',
            title: {
              UA: 'Міністерство розвитку громад та територій України',
              EN: 'Ministry of Development of Communities and Territories of Ukraine',
              RU: 'Министерство развития общин и территорий Украины',
            },
            email: 'zapyt@minregion.gov.ua',
          },
          {
            key: 'MINISTRY_OF_SOCIAL_POLICY_OF_UKRAINE',
            title: {
              UA: 'Міністерство соціальної політики України',
              EN: 'Ministry of Social Policy of Ukraine',
              RU: 'Министерство социальной политики Украины',
            },
            email: 'zvernennya@mlsp.gov.ua',
          },
          {
            key: 'MINISTRY_OF_VETERANS_AFFAIRS_OF_UKRAINE',
            title: {
              UA: 'Міністерство у справах ветеранів України',
              EN: 'Ministry of Veterans Affairs of Ukraine',
              RU: 'Министерство по делам ветеранов Украины',
            },
            email: 'info@mva.gov.ua',
          },
          {
            key: 'MINISTRY_OF_FINANCE_OF_UKRAINE',
            title: {
              UA: 'Міністерство фінансів України',
              EN: 'Ministry of Finance of Ukraine',
              RU: 'Министерство финансов Украины',
            },
            email: 'infomf@minfin.gov.ua',
          },
          {
            key: 'MINISTRY_OF_JUSTICE_OF_UKRAINE',
            title: {
              UA: 'Міністерство юстиції України',
              EN: 'Ministry of Justice of Ukraine',
              RU: 'Министерство юстиции Украины',
            },
            email: 'callcentre@minjust.gov.ua',
          },
        ],
      },
      {
        key: 'SERVICES',
        title: {
          UA: 'Служби',
          EN: 'Services',
          RU: 'Службы',
        },
        subTags: [
          {
            key: 'STATE_AUDIT_OFFICE_OF_UKRAINE',
            title: {
              UA: 'Державна аудиторська служба України',
              EN: 'State Audit Office of Ukraine',
              RU: 'Государственная аудиторская служба Украины',
            },
            email: 'postmast@dkrs.gov.ua',
          },
          {
            key: 'STATE_TAX_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна податкова служба України',
              EN: 'State Tax Service of Ukraine',
              RU: 'Государственная налоговая служба Украины',
            },
            email: 'zvernennya_dps@tax.gov.ua',
          },
          {
            key: 'STATE_SERVICE_FOR_URBAN_DEVELOPMENT_OF_UKRAINE',
            title: {
              UA: 'Державна сервісна служба містобудування України',
              EN: 'State Service for Urban Development of Ukraine',
              RU: 'Государственная сервисная служба градостроительства Украины',
            },
            email: 'minregion@minregion.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_ETHNOPOLITICS_AND_FREEDOM_OF_CONSCIENCE',
            title: {
              UA: 'Державна служба України з етнополітики та свободи совісті',
              EN: 'State Service of Ukraine for Ethnopolitics and Freedom of Conscience',
              RU: 'Государственная служба Украины по этнополитике и свободе совести',
            },
            email: 'fedko@nads.gov.ua',
          },
          {
            key: 'NATIONAL_HEALTH_SERVICE_OF_UKRAINE',
            title: {
              UA: "Національна служба здоров'я України",
              EN: 'National Health Service of Ukraine',
              RU: 'Национальная служба здоровья Украины',
            },
            email: 'info@nszu.gov.ua',
          },
          {
            key: 'STATE_SOCIAL_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна соціальна служба України',
              EN: 'State Social Service of Ukraine',
              RU: 'Государственная социальная служба Украины',
            },
            email: 'zvernennya@mlsp.gov.ua',
          },
          {
            key: 'STATE_CUSTOMS_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна митна служба України',
              EN: 'State Customs Service of Ukraine',
              RU: 'Государственная таможенная служба Украины',
            },
            email: 'publishinfo@customs.gov.ua',
          },
          {
            key: 'STATE_AVIATION_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна авіаційна службa України',
              EN: 'State Aviation Service of Ukraine',
              RU: 'Государственная авиационная службa Украины',
            },
            email: 'vdz@avia.gov.ua',
          },
          {
            key: 'STATE_ARCHIVAL_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна архівна службa України',
              EN: 'State Archival Service of Ukraine',
              RU: 'Государственная архивная службa Украины',
            },
            email: 'info@arch.gov.ua',
          },
          {
            key: 'STATE_TREASURY_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна казначейська служба України',
              EN: 'State Treasury Service of Ukraine',
              RU: 'Государственная казначейская служба Украины',
            },
            email: 'office@treasury.gov.ua',
          },
          {
            key: 'STATE_MIGRATION_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна міграційна служба України',
              EN: 'State Migration Service of Ukraine',
              RU: 'Государственная миграционная служба Украины',
            },
            email: 'vdz@dmsu.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_MARITIME_AND_RIVER_TRANSPORT_OF_UKRAINE',
            title: {
              UA: 'Державна служба морського та річкового транспорту України',
              EN: 'State Service of Maritime and River Transport of Ukraine',
              RU: 'Государственная служба морского и речного транспорта Украины',
            },
            email: 'office@marad.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_TRANSPORT_SAFETY',
            title: {
              UA: 'Державна служба України з безпеки на транспорті',
              EN: 'State Service of Ukraine for Transport Safety',
              RU: 'Государственная служба Украины по безопасности на транспорте',
            },
            email: 'contact@dsbt.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_FOOD_SAFETY_AND_CONSUMER_PROTECTION',
            title: {
              UA:
                'Державна служба України з питань безпечності харчових продуктів та захисту споживачів',
              EN: 'State Service of Ukraine for Food Safety and Consumer Protection',
              RU:
                'Государственная служба Украины по вопросам безопасности пищевых продуктов и защиты потребителей',
            },
            email: 'info@dpss.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_GEODESY_AND_CARTOGRAPHY_AND_CADASTRE',
            title: {
              UA: 'Державна служба України з питань геодезії, картографії та кадастру',
              EN: 'State Service of Ukraine for Geodesy, Cartography and Cadastre',
              RU: 'Государственная служба Украины по вопросам геодезии, картографии и кадастра',
            },
            email: 'land@land.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_GEOLOGY_AND_SUBSOIL_OF_UKRAINE',
            title: {
              UA: 'Державна служба геології та надр України',
              EN: 'State Service of Geology and Subsoil of Ukraine',
              RU: 'Государственная служба геологии и недр Украины',
            },
            email: 'e.vikno@geo.gov.ua',
          },
          {
            key: 'STATE_LABOR_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна служба України з питань праці',
              EN: 'State Labor Service of Ukraine',
              RU: 'Государственная служба Украины по вопросам труда',
            },
            email: 'dsp@dsp.gov.ua',
          },
          {
            key: 'STATE_STATISTICS_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна служба статистики України',
              EN: 'State Statistics Service of Ukraine',
              RU: 'Государственная служба статистики Украины',
            },
            email: 'office@ukrstat.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_MEDICINES_AND_DRUG_CONTROL',
            title: {
              UA: 'Державна служба України з лікарських засобів та контролю за наркотиками',
              EN: 'State Service of Ukraine for Medicines and Drug Control',
              RU: 'Государственная служба Украины лекарственных средств и контроля за наркотиками',
            },
            email: 'dls@dls.gov.ua',
          },
          {
            key: 'STATE_SERVICE_OF_UKRAINE_FOR_EMERGENCIES',
            title: {
              UA: 'Державна служба України з надзвичайних ситуацій',
              EN: 'State Service of Ukraine for Emergencies',
              RU: 'Государственная служба Украины по чрезвычайным ситуациям',
            },
            email: 'oper@dsns.gov.ua',
          },
          {
            key: 'STATE_FINANCIAL_MONITORING_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна служба фінансового моніторингу України',
              EN: 'State Financial Monitoring Service of Ukraine',
              RU: 'Государственная служба финансового мониторинга Украины',
            },
            email: 'office@fiu.gov.ua',
          },
          {
            key: 'STATE_EXPORT_CONTROL_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна служба експортного контролю України',
              EN: 'State Export Control Service of Ukraine',
              RU: 'Государственная служба экспортного контроля Украины',
            },
            email: 'general@dsecu.gov.ua',
          },
          {
            key: 'STATE_REGULATORY_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна регуляторна служба України',
              EN: 'State Regulatory Service of Ukraine',
              RU: 'Государственная регуляторная служба Украины',
            },
            email: 'inform@drs.gov.ua',
          },
          {
            key: 'STATE_FISCAL_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна фіскальна служба України',
              EN: 'State Fiscal Service of Ukraine',
              RU: 'Государственная фискальная служба Украины',
            },
            email: 'zvernennya@sfs.gov.ua',
          },
          {
            key: 'STATE_EDUCATION_QUALITY_SERVICE_OF_UKRAINE',
            title: {
              UA: 'Державна служба якості освіти України',
              EN: 'State Education Quality Service of Ukraine',
              RU: 'Государственная служба качества образования Украины',
            },
            email: 'sqe@sqe.gov.ua',
          },
        ],
      },
      {
        key: 'AGENCIES',
        title: {
          UA: 'Агентства',
          EN: 'Agencies',
          RU: 'Агентства',
        },
        subTags: [
          {
            key: 'PUBLIC_DEBT_MANAGEMENT_AGENCY_OF_UKRAINE',
            title: {
              UA: 'Агентство з управління державним боргом України',
              EN: 'Public Debt Management Agency of Ukraine',
              RU: 'Агентство по управлению государственным долгом Украины',
            },
            email: 'infomf@minfin.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_UKRAINE_FOR_ART_EDUCATION',
            title: {
              UA: 'Державне агентство України з питань мистецької освіти',
              EN: 'State Agency of Ukraine for Art Education',
              RU: 'Государственное агентство Украины по вопросам художественного образования',
            },
            email: 'zapyty@mkms.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_MOTOR_ROADS_OF_UKRAINE',
            title: {
              UA: 'Державне агентство автомобільних доріг України',
              EN: 'State Agency of Motor Roads of Ukraine',
              RU: 'Государственное агентство автомобильных дорог Украины',
            },
            email: 'kae@ukravtodor.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_WATER_RESOURCES_OF_UKRAINE',
            title: {
              UA: 'Державне агентство водних ресурсів України',
              EN: 'State Agency of Water Resources of Ukraine',
              RU: 'Государственное агентство водных ресурсов Украины',
            },
            email: 'davr@davr.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_FOREST_RESOURCES_OF_UKRAINE',
            title: {
              UA: 'Державне агентство лісових ресурсів України',
              EN: 'State Agency of Forest Resources of Ukraine',
              RU: 'Государственное агентство лесных ресурсов Украины',
            },
            email: 'sprava@forest.gov.ua',
          },
          {
            key: 'STATE_RESERVE_AGENCY_OF_UKRAINE',
            title: {
              UA: 'Державне агентство резерву України',
              EN: 'State Reserve Agency of Ukraine',
              RU: 'Государственное агентство резерва Украины',
            },
            email: 'document@gosrezerv.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_FISHERIES_OF_UKRAINE',
            title: {
              UA: 'Державне агентство рибного господарства України',
              EN: 'State Agency of Fisheries of Ukraine',
              RU: 'Государственное агентство рыбного хозяйства Украины',
            },
            email: 'darg@darg.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_UKRAINE_FOR_CINEMA',
            title: {
              UA: 'Державне агентство України з питань кіно',
              EN: 'State Agency of Ukraine for Cinema',
              RU: 'Государственное агентство Украины по вопросам кино',
            },
            email: 'info@dergkino.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_UKRAINE_FOR_ARTS',
            title: {
              UA: 'Державне агентство України з питань мистецтв',
              EN: 'State Agency of Ukraine for Arts',
              RU: 'Государственное агентство Украины по вопросам искусств',
            },
            email: 'public_info@mincult.gov.ua',
          },
          {
            key: 'STATE_AGENCY_FOR_TOURISM_DEVELOPMENT_OF_UKRAINE',
            title: {
              UA: 'Державне агентство розвитку туризму України',
              EN: 'State Agency for Tourism Development of Ukraine',
              RU: 'Государственное агентство развития туризма Украины',
            },
            email: 'public_info@mincult.gov.ua',
          },
          {
            key: 'STATE_AGENCY_OF_UKRAINE_FOR_EXCLUSION_ZONE_MANAGEMENT',
            title: {
              UA: 'Державне агентство України з управління зоною відчуження',
              EN: 'State Agency of Ukraine for Exclusion Zone Management',
              RU: 'Государственное агентство Украины по управлению зоной отчуждения',
            },
            email: 'office@dazv.gov.ua',
          },
          {
            key: 'STATE_SPACE_AGENCY_OF_UKRAINE',
            title: {
              UA: 'Державне космічне агентство України',
              EN: 'State Space Agency of Ukraine',
              RU: 'Государственное космическое агентство Украины',
            },
            email: 'yd@nkau.gov.ua',
          },
          {
            key:
              'NATIONAL_AGENCY_OF_UKRAINE_FOR_DETECTION_AND_INVESTIGATION_AND_MANAGEMENT_OF_ASSETS_OBTAINED_FROM_CORRUPTION_AND_OTHER_CRIMES',
            title: {
              UA:
                'Національне агентство України з питань виявлення, розшуку та управління активами, одержаними від корупційних тa інших злочинів',
              EN:
                'National Agency of Ukraine for Detection, Investigation and Management of Assets Obtained from Corruption and Other Crimes',
              RU:
                'Национальное агентство Украины по вопросам выявления, розыска и управления активами, полученными от коррупционных и других преступлений',
            },
            email: 'info@arma.gov.ua',
          },
          {
            key: 'STATE_AGENCY_FOR_INFRASTRUCTURE_PROJECTS_OF_UKRAINE',
            title: {
              UA: 'Державне агентство інфраструктурних проектів України',
              EN: 'State Agency for Infrastructure Projects of Ukraine',
              RU: 'Государственное агентство инфраструктурных проектов Украины',
            },
            email: 'press@mtu.gov.ua',
          },
          {
            key: 'STATE_AGENCY_FOR_ENERGY_EFFICIENCY_AND_ENERGY_SAVING_OF_UKRAINE',
            title: {
              UA: 'Державне агентство з енергоефективності та енергозбереження України',
              EN: 'State Agency for Energy Efficiency and Energy Saving of Ukraine',
              RU: 'Государственное агентство по энергоэффективности и энергосбережению Украины',
            },
            email: 'saeepressa@gmail.com',
          },
          {
            key: 'NATIONAL_AGENCY_OF_UKRAINE_FOR_CIVIL_SERVICE_AFFAIRS',
            title: {
              UA: 'Національне агентство України з питань державної cлужби',
              EN: 'National Agency of Ukraine for Civil Service Affairs',
              RU: 'Национальное агентство Украины по вопросам государственной службы',
            },
            email: 'zagal@nads.gov.ua',
          },
          {
            key: 'NATIONAL_AGENCY_FOR_THE_PREVENTION_OF_CORRUPTION',
            title: {
              UA: 'Національне агентство з питань запобігання корупції',
              EN: 'National Agency for the Prevention of Corruption',
              RU: 'Национальное агентство по предупреждению коррупции',
            },
            email: 'info@nazk.gov.ua',
          },
        ],
      },
      {
        key: 'INSPECTIONS',
        title: {
          UA: 'Інспекції',
          EN: 'Inspections',
          RU: 'Инспекции',
        },
        subTags: [
          {
            key: 'STATE_INSPECTORATE_FOR_CULTURAL_HERITAGE_OF_UKRAINE',
            title: {
              UA: 'Державна інспекція культурної спадщини України',
              EN: 'State Inspectorate for Cultural Heritage of Ukraine',
              RU: 'Государственная инспекция культурного наследия Украины',
            },
            email: 'public_info@mincult.gov.ua',
          },
          {
            key: 'STATE_INSPECTORATE_FOR_ENERGY_SUPERVISION_OF_UKRAINE',
            title: {
              UA: 'Державна інспекція енергетичного нагляду України',
              EN: 'State Inspectorate for Energy Supervision of Ukraine',
              RU: 'Государственная инспекция энергетического надзора Украины',
            },
            email: 'bureau@sies.gov.ua',
          },
          {
            key: 'STATE_INSPECTORATE_FOR_URBAN_DEVELOPMENT_OF_UKRAINE',
            title: {
              UA: 'Державна інспекція містобудування України',
              EN: 'State Inspectorate for Urban Development of Ukraine',
              RU: 'Государственная инспекция градостроительства Украины',
            },
            email: 'public@dabi.gov.ua',
          },
          {
            key: 'STATE_ECOLOGICAL_INSPECTORATE_OF_UKRAINE',
            title: {
              UA: 'Державна екологічна інспекція України',
              EN: 'State Ecological Inspectorate of Ukraine',
              RU: 'Государственная экологическая инспекция Украины',
            },
            email: 'info@dei.gov.ua.',
          },
          {
            key: 'STATE_INSPECTORATE_FOR_NUCLEAR_REGULATION_OF_UKRAINE',
            title: {
              UA: 'Державна інспекція ядерного регулювання України',
              EN: 'State Inspectorate for Nuclear Regulation of Ukraine',
              RU: 'Государственная инспекция ядерного регулирования Украины',
            },
            email: 'pr@hq.snrc.gov.ua',
          },
        ],
      },
      {
        key: 'CEB_WITH_SPECIAL_STATUS',
        title: {
          UA: 'ЦОВВ зі спеціальним статусом',
          EN: 'CEB with special status',
          RU: 'ЦОИВ со специальным статусом',
        },
        subTags: [
          {
            key:
              'ADMINISTRATION_OF_THE_STATE_SERVICE_FOR_SPECIAL_COMMUNICATIONS_AND_INFORMATION_PROTECTION_OF_UKRAINE',
            title: {
              UA:
                "Адміністрація Державної служби спеціального зв'язку та захисту інформації України",
              EN:
                'Administration of the State Service for Special Communications and Information Protection of Ukraine',
              RU:
                'Администрация Государственной службы специальной связи и защиты информации Украины',
            },
            email: 'info@dsszzi.gov.ua',
          },
          {
            key: 'NATIONAL_COMMISSION_FOR_STATE_LANGUAGE_STANDARDS',
            title: {
              UA: 'Національна комісія зі стандартів державної мови',
              EN: 'National Commission for State Language Standards',
              RU: 'Национальная комиссия по стандартам государственного языка',
            },
            email: 'ez@mon.gov.ua',
          },
          {
            key: 'STATE_COMMITTEE_FOR_TELEVISION_AND_RADIO_BROADCASTING_OF_UKRAINE',
            title: {
              UA: 'Державний комітет телебачення і радіомовлення України',
              EN: 'State Committee for Television and Radio Broadcasting of Ukraine',
              RU: 'Государственный комитет телевидения и радиовещания Украины',
            },
            email: 'appeals@comin.gov.ua',
          },
          {
            key: 'ANTIMONOPOLY_COMMITTEE_OF_UKRAINE',
            title: {
              UA: 'Антимонопольний комітет України',
              EN: 'Antimonopoly Committee of Ukraine',
              RU: 'Антимонопольный комитет Украины',
            },
            email: 'slg@amcu.gov.ua',
          },
          {
            key: 'STATE_PROPERTY_FUND_OF_UKRAINE',
            title: {
              UA: 'Фонд державного майна України',
              EN: 'State Property Fund of Ukraine',
              RU: 'Фонд государственного имущества Украины',
            },
            email: 'zaput@spfu.gov.ua',
          },
        ],
      },
      {
        key: 'COLLEGIATE_BODIES',
        title: {
          UA: 'Колегіальні Органи',
          EN: 'Collegiate Bodies',
          RU: 'Коллегиальные органы',
        },
        subTags: [
          {
            key: 'NATIONAL_COMMISSION_FOR_STATE_REGULATION_OF_COMMUNICATIONS_AND_INFORMATIZATION',
            title: {
              UA:
                'Національна комісія, що здійснює державне регулювання у сфері зв’язку та інформатизації',
              EN: 'National Commission for State Regulation of Communications and Informatization',
              RU:
                'Национальная комиссия, осуществляющая государственное регулирование в сфере связи и информатизации',
            },
            email: 'e_zvernen@nkrzi.gov.ua',
          },
          {
            key: 'NATIONAL_COMMISSION_FOR_STATE_REGULATION_OF_ENERGY_AND_UTILITIES',
            title: {
              UA:
                'Національна комісія, що здійснює державне регулювання у сферах енергетики та комунальних послуг',
              EN: 'National Commission for State Regulation of Energy and Utilities',
              RU:
                'Национальная комиссия, осуществляющая государственное регулирование в сферах энергетики и коммунальных услуг',
            },
            email: 'box@nerc.gov.ua',
          },
          {
            key: 'NATIONAL_COMMISSION_ON_SECURITIES_AND_STOCK_MARKET',
            title: {
              UA: 'Національна комісія з цінних паперів та фондового ринку',
              EN: 'National Commission on Securities and Stock Market',
              RU: 'Национальная комиссия по ценным бумагам и фондовому рынку',
            },
            email: 'info@nssmc.gov.ua',
          },
          {
            key: 'NATIONAL_COMMISSION_FOR_STATE_REGULATION_OF_FINANCIAL_SERVICES_MARKETS',
            title: {
              UA:
                'Національна комісія, що здійснює державне регулювання у сфері ринків фінансових послуг',
              EN: 'National Commission for State Regulation of Financial Services Markets',
              RU:
                'Национальная комиссия, осуществляющая государственное регулирование в сфере рынков финансовых услуг',
            },
            email: 'office@nfp.gov.ua',
          },
        ],
      },
      {
        key: 'OTHER_CEBS',
        title: {
          UA: 'Інші ЦОВВ',
          EN: 'Other CEBs',
          RU: 'Другие ЦОИВ',
        },
        subTags: [
          {
            key: 'HIGH_COUNCIL_OF_JUSTICE',
            title: {
              UA: 'Вища рада правосуддя',
              EN: 'High Council of Justice',
              RU: 'Высший совет правосудия',
            },
            email: 'adpsu@dpsu.gov.ua',
          },
          {
            key: 'PENSION_FUND_OF_UKRAINE',
            title: {
              UA: 'Пенсійний фонд України',
              EN: 'Pension Fund of Ukraine',
              RU: 'Пенсионный фонд Украины',
            },
            email: 'info@pfu.gov.ua',
          },
        ],
      },
      {
        key: 'LOCAL_AUTHORITIES',
        title: {
          UA: 'Місцеві органи влади',
          EN: 'Local authorities',
          RU: 'Местные органы власти',
        },
        subTags: [
          {
            key: 'VINNYTSIA_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Вінницька обласна державна адміністрація',
              EN: 'Vinnytsia Regional State Administration',
              RU: 'Винницкая областная государственная администрация',
            },
            email: 'oda@vin.gov.ua',
          },
          {
            key: 'VOLYN_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Волинська обласна державна адміністрація',
              EN: 'Volyn Regional State Administration',
              RU: 'Волынская областная государственная администрация',
            },
            email: 'post@voladm.gov.ua',
          },
          {
            key: 'DNIPROPETROVSK_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Дніпропетровська обласна державна адміністрація',
              EN: 'Dnipropetrovsk Regional State Administration',
              RU: 'Днепропетровская областная государственная администрация',
            },
            email: 'info@adm.dp.gov.ua',
          },
          {
            key: 'DONETSK_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Донецька обласна державна адміністрація',
              EN: 'Donetsk Regional State Administration',
              RU: 'Донецкая областная государственная администрация',
            },
            email: 'citizen@dn.gov.ua',
          },
          {
            key: 'ZHYTOMYR_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Житомирська обласна державна адміністрація',
              EN: 'Zhytomyr Regional State Administration',
              RU: 'Житомирская областная государственная администрация',
            },
            email: 'ztadm@apoda.zht.gov.ua',
          },
          {
            key: 'TRANSCARPATHIAN_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Закарпатська обласна державна адміністрація',
              EN: 'Transcarpathian Regional State Administration',
              RU: 'Закарпатская областная государственная администрация',
            },
            email: 'admin@carpathia.gov.ua',
          },
          {
            key: 'ZAPORIZHIA_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Запорізька обласна державна адміністрація',
              EN: 'Zaporizhia Regional State Administration',
              RU: 'Запорожская областная государственная администрация',
            },
            email: 'adm@zoda.gov.ua',
          },
          {
            key: 'IVANO_FRANKIVSK_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Івано-Франківська обласна державна адміністрація',
              EN: 'Ivano-Frankivsk Regional State Administration',
              RU: 'Ивано-Франковская областная государственная администрация',
            },
            email: 'vp@if.gov.ua',
          },
          {
            key: 'KYIV_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Київська обласна державна адміністрація',
              EN: 'Kyiv Regional State Administration',
              RU: 'Киевская областная государственная администрация',
            },
            email: 'zvern@koda.gov.ua',
          },
          {
            key: 'KIROVOHRAD_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Кіровоградська обласна державна адміністрація',
              EN: 'Kirovohrad Regional State Administration',
              RU: 'Кировоградская областная государственная администрация',
            },
            email: 'public@kr-admin.gov.ua',
          },
          {
            key: 'LUHANSK_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Луганська обласна державна адміністрація',
              EN: 'Luhansk Regional State Administration',
              RU: 'Луганская областная государственная администрация',
            },
            email: 'info@loga.gov.ua',
          },
          {
            key: 'LVIV_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Львівська обласна державна адміністрація',
              EN: 'Lviv Regional State Administration',
              RU: 'Львовская областная государственная администрация',
            },
            email: 'zvern@loda.gov.ua',
          },
          {
            key: 'MYKOLAYIV_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Миколаївська обласна державна адміністрація',
              EN: 'Mykolayiv Regional State Administration',
              RU: 'Николаевская областная государственная администрация',
            },
            email: 'cancelar@mk.gov.ua',
          },
          {
            key: 'ODESSA_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Одеська обласна державна адміністрація',
              EN: 'Odessa Regional State Administration',
              RU: 'Одесская областная государственная администрация',
            },
            email: 'obr_citizen@odessa.gov.ua',
          },
          {
            key: 'POLTAVA_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Полтавська обласна державна адміністрація',
              EN: 'Poltava Regional State Administration',
              RU: 'Полтавская областная государственная администрация',
            },
            email: 'oda@adm-pl.gov.ua',
          },
          {
            key: 'RIVNE_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Рівненська обласна державна адміністрація',
              EN: 'Rivne Regional State Administration',
              RU: 'Ровенская областная государственная администрация',
            },
            email: 'roda@rv.gov.ua',
          },
          {
            key: 'SUMY_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Сумська обласна державна адміністрація',
              EN: 'Sumy Regional State Administration',
              RU: 'Сумская областная государственная администрация',
            },
            email: 'mail@sm.gov.ua',
          },
          {
            key: 'TERNOPIL_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Тернопільська обласна державна адміністрація',
              EN: 'Ternopil Regional State Administration',
              RU: 'Тернопольская областная государственная администрация',
            },
            email: 'odapress.te@gmail.com',
          },
          {
            key: 'KHARKIV_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Харківська обласна державна адміністрація',
              EN: 'Kharkiv Regional State Administration',
              RU: 'Харьковская областная государственная администрация',
            },
            email: 'obladm@kharkivoda.gov.ua',
          },
          {
            key: 'KHERSON_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Херсонська обласна державна адміністрація',
              EN: 'Kherson Regional State Administration',
              RU: 'Херсонская областная государственная администрация',
            },
            email: 'dp-inform@khoda.gov.ua',
          },
          {
            key: 'KHMELNYTSKY_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Хмельницька обласна державна адміністрація',
              EN: 'Khmelnytsky Regional State Administration',
              RU: 'Хмельницкая областная государственная администрация',
            },
            email: 'regadm@adm-km.gov.ua',
          },
          {
            key: 'CHERKASY_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Черкаська обласна державна адміністрація',
              EN: 'Cherkasy Regional State Administration',
              RU: 'Черкасская областная государственная администрация',
            },
            email: 'cancelar@ck-oda.gov.ua',
          },
          {
            key: 'CHERNIVTSI_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Чернівецька обласна державна адміністрація',
              EN: 'Chernivtsi Regional State Administration',
              RU: 'Черновицкая областная государственная администрация',
            },
            email: 'press.oda@ukr.net',
          },
          {
            key: 'CHERNIHIV_REGIONAL_STATE_ADMINISTRATION',
            title: {
              UA: 'Чернігівська обласна державна адміністрація',
              EN: 'Chernihiv Regional State Administration',
              RU: 'Черниговская областная государственная администрация',
            },
            email: 'post@regadm.gov.ua',
          },
          {
            key: 'KYIV_CITY_STATE_ADMINISTRATION',
            title: {
              UA: 'Київська міська державна адміністрація',
              EN: 'Kyiv City State Administration',
              RU: 'Киевская городская государственная администрация',
            },
            email: 'zvernen@kmda.gov.ua',
          },
        ],
      },
    ],
  },
  {
    key: 'JUDICIARY',
    title: {
      UA: 'Судова влада',
      EN: 'Judiciary',
      RU: 'Судовая власть',
    },
    subTags: [
      {
        key: 'CONSTITUTIONAL_COURT',
        title: {
          UA: 'Конституційний суд',
          EN: 'Constitutional Court',
          RU: 'Конституционный суд',
        },
        email: 'inbox@ccu.gov.ua',
      },
      {
        key: 'SUPREME_COURT',
        title: {
          UA: 'Верховний суд',
          EN: 'Supreme Court',
          RU: 'Верховный суд',
        },
        email: 'inbox@supreme.court.gov.ua',
      },
      {
        key: 'SUPREME_COMMERCIAL_COURT_OF_UKRAINE',
        title: {
          UA: 'Вищий господарський суд України',
          EN: 'Supreme Commercial Court of Ukraine',
          RU: 'Высший хозяйственный суд Украины',
        },
        email: 'inbox@vgsu.arbitr.gov.ua',
      },
      {
        key: 'SUPREME_ADMINISTRATIVE_COURT_OF_UKRAINE',
        title: {
          UA: 'Вищий адміністративний суд України',
          EN: 'Supreme Administrative Court of Ukraine',
          RU: 'Высший административный суд Украины',
        },
        email: 'vasu@vasu.gov.ua',
      },
    ],
  },
  {
    key: 'OFFICE_OF_THE_PRESIDENT',
    title: {
      UA: 'Офіс президента',
      EN: 'Office of the President',
      RU: 'Офис Президента',
    },
    subTags: [
      {
        key: 'OFFICE_OF_THE_PRESIDENT',
        title: {
          UA: 'Офіс президента',
          EN: 'Office of the President',
          RU: 'Офис Президента',
        },
        email: 'press@apu.gov.ua',
      },
    ],
  },
  {
    key: 'OTHER',
    title: {
      UA: 'Інше',
      EN: 'Other',
      RU: 'Другое',
    },
    subTags: [
      {
        key: 'OFFICE_OF_THE_PROSECUTOR_GENERAL',
        title: {
          UA: 'Офіс генпрокурора',
          EN: 'Office of the Prosecutor General',
          RU: 'Офис Генпрокурора',
        },
        email: 'public@gp.gov.ua',
      },
      {
        key: 'NATIONAL_BANK',
        title: {
          UA: 'Національний банк',
          EN: 'National Bank',
          RU: 'Национальный банк',
        },
        email: 'nbu@bank.gov.ua',
      },
      {
        key: 'NKREKP',
        title: {
          UA: 'НКРЕКП',
          EN: 'NKREKP',
          RU: 'НКРЕКП',
        },
        email: 'box@nerc.gov.ua',
      },
      {
        key: 'NABU',
        title: {
          UA: 'НАБУ',
          EN: 'NABU',
          RU: 'НАБУ',
        },
        email: 'info@nabu.gov.ua',
      },
      {
        key: 'NATIONAL_POLICE_OF_UKRAINE',
        title: {
          UA: 'Національна поліція України',
          EN: 'National Police of Ukraine',
          RU: 'Национальная полиция Украина',
        },
        email: 'info@police.gov.ua',
      },
      {
        key: 'SAP',
        title: {
          UA: 'САП',
          EN: 'SAP',
          RU: 'САП',
        },
        email: 'public@gp.gov.ua',
      },
      {
        key: 'NAPC',
        title: {
          UA: 'НАЗК',
          EN: 'NAPC',
          RU: 'НАПК',
        },
        email: 'info@nazk.gov.ua',
      },
      {
        key: 'zv',
        email: 'cvhqc@gov.ua',
        title: {
          EN: 'ZV',
          RU: 'Законодательная власть',
          UA: 'Законодавча влада',
        },
        isDeprecated: true,
      },
      {
        key: 'iv',
        email: 'cwhv@gov.ua',
        title: {
          EN: 'IV',
          RU: 'Исполнительная власть',
          UA: 'Виконавча влада',
        },
        isDeprecated: true,
      },
      {
        key: 'sv',
        email: 'mges@gov.ua',
        title: {
          EN: 'SV',
          RU: 'Судебная власть',
          UA: 'Судова влада',
        },
        isDeprecated: true,
      },
      {
        key: 'mv',
        email: 'mist@gov.ua',
        title: {
          EN: 'MV',
          RU: 'Местная власть',
          UA: 'Місцева влада',
        },
        isDeprecated: true,
      },
      {
        key: 'op',
        email: 'mge@gov.ua',
        title: {
          EN: 'OP',
          RU: 'Офис Президента',
          UA: 'Офіс Президента',
        },
        isDeprecated: true,
      },
      {
        key: 'gp',
        email: 'msf@gov.ua',
        title: {
          EN: 'GP',
          RU: 'Офис Генпрокурора',
          UA: 'Офіс Генпрокурора',
        },
        isDeprecated: true,
      },
      {
        key: 'nb',
        email: 'mfft@gov.ua',
        title: {
          EN: 'NB',
          RU: 'Национальный Банк',
          UA: 'Національний банк',
        },
        isDeprecated: true,
      },
      {
        key: 'nk',
        email: 'mfft@gov.ua',
        title: {
          EN: 'NK',
          RU: 'НКРЕКП',
          UA: 'НКРЕКП',
        },
        isDeprecated: true,
      },
      {
        key: 'ao',
        email: 'mfft@gov.ua',
        title: {
          EN: 'AO',
          RU: 'Антикоррупционные органы',
          UA: 'Антикорупційні органи',
        },
        isDeprecated: true,
      },
      {
        key: 'nbank',
        email: 'mfft@gov.ua',
        title: {
          EN: 'Nbank',
          RU: 'НАБУ',
          UA: 'НАБУ',
        },
        isDeprecated: true,
      },
    ],
  },
]
