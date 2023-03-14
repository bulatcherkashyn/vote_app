import { Gender } from '../../../../src/iviche/common/Gender'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../src/iviche/common/UserRole'
import { Person } from '../../../../src/iviche/person/model/Person'
import { AuthServiceImpl } from '../../../../src/iviche/security/auth/services/AuthServiceImpl'
import { User } from '../../../../src/iviche/users/models/User'
import { UserDetails } from '../../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../../src/iviche/users/models/UserSystemStatus'

export const publicPersons: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000201',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Peter',
    lastName: 'Petrenko',
    email: 'peter.petrenko@iviche.com',
    phone: '+380440001122#201',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000202',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Vasyl',
    lastName: 'Vasylenko',
    email: 'vasyl.vasylenko@iviche.com',
    phone: '+380440001122#202',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000203',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Ivan',
    lastName: 'Ivanenko',
    email: 'ivan.ivanenko@iviche.com',
    phone: '+380440001122#203',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000204',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Hanna',
    lastName: 'Hannenko',
    email: 'hanna.hannenko@iviche.com',
    phone: '+380440001122#204',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.CLERK,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000205',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Olena',
    lastName: 'Olenenko',
    email: 'olena.olenenko@iviche.com',
    phone: '+380440001122#205',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.CLERK,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000206',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Marina',
    lastName: 'Marinenko',
    email: 'marina.marinenko@iviche.com',
    phone: '+380440001122#206',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.CLERK,
  },
]

export const publicUserDetails: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000201',
    emailConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000202',
    emailConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000203',
    emailConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000204',
    emailConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000205',
    emailConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000206',
    emailConfirmed: true,
  },
]

export const publicUsers: Array<User> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000201',
    username: 'peter.petrenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[0].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000202',
    username: 'vasyl.vasylenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[1].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000203',
    username: 'ivan.ivanenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[2].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000204',
    username: 'hanna.hannenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[3].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000205',
    username: 'olena.olenenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[4].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000206',
    username: 'marina.marinenko@iviche.com',
    password: AuthServiceImpl.encryptPassword('Publicpwd2!'),
    role: UserRole.PRIVATE,
    personUID: publicPersons[5].uid,
    systemStatus: UserSystemStatus.ACTIVE,
  },
]

export const expertPersons: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000301',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Tetiana',
    lastName: 'Chornovol',
    email: 'tetiana.chornovol@iviche.com',
    phone: '+380440001122#301',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000302',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Roman',
    lastName: 'Skrypin',
    email: 'roman.skrypin@iviche.com',
    phone: '+380440001122#302',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000303',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Vitaly',
    lastName: 'Portnikov',
    email: 'vitaly.portnikov@iviche.com',
    phone: '+380440001122#303',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000304',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Taras',
    lastName: 'Berezovets',
    email: 'taras.berezovets@iviche.com',
    phone: '+380440001122#304',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000305',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Olesya',
    lastName: 'Yakhno',
    email: 'olesya.yakhno@iviche.com',
    phone: '+380440001122#305',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000306',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Matvey',
    lastName: 'Ganapolskiy',
    email: 'matvey.ganapolskiy@iviche.com',
    phone: '+380440001122#306',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000307',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Alexey',
    lastName: 'Arestovich',
    email: 'alexey.arestovich@iviche.com',
    phone: '+380440001122#307',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000308',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Yanina',
    lastName: 'Sokolova',
    email: 'yanina.sokolova@iviche.com',
    phone: '+380440001122#308',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000309',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Sonia',
    lastName: 'Koshkina',
    email: 'sonia.koshkina@iviche.com',
    phone: '+380440001122#309',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
  },
]

export const expertUserDetails: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000301',
    emailConfirmed: true,
    wpJournalistID: 301,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000302',
    emailConfirmed: true,
    wpJournalistID: 302,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000303',
    emailConfirmed: true,
    wpJournalistID: 303,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000304',
    emailConfirmed: true,
    wpJournalistID: 304,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000305',
    emailConfirmed: true,
    wpJournalistID: 305,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000306',
    emailConfirmed: true,
    wpJournalistID: 306,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000307',
    emailConfirmed: true,
    wpJournalistID: 307,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000308',
    emailConfirmed: true,
    wpJournalistID: 308,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000309',
    emailConfirmed: true,
    wpJournalistID: 309,
  },
]

export const expertUsers: Array<User> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000301',
    username: 'tetiana.chornovol@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[0].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000302',
    username: 'roman.skrypin@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[1].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000303',
    username: 'vitaly.portnikov@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[2].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000304',
    username: 'taras.berezovets@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[3].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000305',
    username: 'olesya.yakhno@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[4].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000306',
    username: 'matvey.ganapolskiy@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[5].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000307',
    username: 'alexey.arestovich@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[6].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000308',
    username: 'yanina.sokolova@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[7].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000309',
    username: 'sonia.koshkina@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: expertPersons[8].uid,
  },
]

export const additionalPersonsData: Array<Person> = publicPersons.concat(expertPersons)

export const additionalUserDetailsData: Array<UserDetails> = publicUserDetails.concat(
  expertUserDetails,
)

export const additionalUsersData: Array<User> = publicUsers.concat(expertUsers)
