import { MasterCollection } from './master-collection'

import MasterQuote from '@bldr/master-quote'
import MasterGeneric from '@bldr/master-generic'

const masterCollection = new MasterCollection()
masterCollection.createMasterBySpec(MasterQuote)
masterCollection.createMasterBySpec(MasterGeneric)

export default masterCollection
