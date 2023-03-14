import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { collectBasicStatistics } from './functions/collectBasicStatistics'

collectBasicStatistics(new DBConnection().getConnection())
