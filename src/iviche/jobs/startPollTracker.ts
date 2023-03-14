import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { pollTracker } from './functions/pollTracker'

pollTracker(new DBConnection().getConnection())
