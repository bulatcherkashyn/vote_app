import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { Elastic } from '../elastic/Elastic'
import { deleteOldNotifications } from './functions/deleteOldNotifications'

deleteOldNotifications(new DBConnection().getConnection(), new Elastic(), 1000)
