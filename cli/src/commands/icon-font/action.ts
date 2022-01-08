// Project packages.
import generateIconFont from '@bldr/icon-font-generator'

export default async function action (): Promise<void> {
  await generateIconFont()
}
