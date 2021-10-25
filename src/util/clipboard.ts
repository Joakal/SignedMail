import { copyToClipboard, Notify } from 'quasar'

export const addToClipboard = ({label, value}: {label: string, value: string}): Promise<void> => {
  return copyToClipboard(value)
  .then(() => {
    Notify.create({
      type: 'positive',
      message: `Copied ${label} to clipboard`
    })
  })
}