import { Script } from 'vm'

/**
 * Returns the error when trying to create a script.
 */
const getStack = (input) => {
  let s
  try {
    new Script(input)
  } catch ({ stack }) {
    s = stack
  }
  if (!s) throw new Error('Could not get the stack.')
  return s
}

export default getStack