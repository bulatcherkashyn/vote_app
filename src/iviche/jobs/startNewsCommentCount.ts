import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { newsCommentCount } from './functions/newsCommentCount'

newsCommentCount(new DBConnection().getConnection())
