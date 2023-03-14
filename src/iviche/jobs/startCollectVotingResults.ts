import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { collectVotingResults } from './functions/collectVotingResults'

collectVotingResults(new DBConnection().getConnection())
