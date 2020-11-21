import { MasterCollection } from './master-collection'

import MasterQuote from '@bldr/master-quote'

const masterCollection = new MasterCollection()
masterCollection.createMasterBySpec(MasterQuote)
export default masterCollection
