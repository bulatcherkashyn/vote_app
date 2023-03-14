import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { pollCommentCount } from './functions/pollCommentCount'

pollCommentCount(new DBConnection().getConnection())
