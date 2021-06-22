// Project packages.
import generateIconFont from '@bldr/icon-font-generator'

async function action (): Promise<void> {
  await generateIconFont()
}

export = action
