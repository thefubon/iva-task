import type { Field, TextField } from 'payload'

/** Hex-цвет текстом. В demo нет ColorField-компонента админки. */
export function colorField(
  args: Pick<TextField, 'name' | 'label' | 'admin' | 'defaultValue' | 'required'>,
): Field {
  return {
    type: 'text',
    name: args.name,
    label: args.label,
    required: args.required,
    defaultValue: args.defaultValue,
    admin: {
      description: 'Hex, например #0F6F4D',
      ...args.admin,
    },
  }
}
