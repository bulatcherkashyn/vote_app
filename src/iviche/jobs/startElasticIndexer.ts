import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { elasticIndexer } from './IndexTaskQueue/elasticIndexer'

elasticIndexer(new DBConnection().getConnection())
