import { TreeNode } from './VisibleNodesGenerator'

export function pick<T>(source: T, keys: string[]): Partial<T> {
  if (keys && typeof keys === 'object') {
    return (Array.isArray(keys) ? keys : Object.keys(keys)).reduce(
      (copy, key) => {
        if (key in source) {
          copy[key as keyof T] = source[key as keyof T]
        }
        return copy
      },
      {} as Partial<T>,
    )
  }
  return {} as Partial<T>
}

export enum OperatingSystems {
  Windows = 'Windows',
  macOS = 'Macintosh',
  others = 'unknown',
}

function detectOS(): OperatingSystems {
  const {
    navigator: { userAgent },
  } = window
  if (userAgent.indexOf(OperatingSystems.Windows) !== -1) return OperatingSystems.Windows
  else if (userAgent.indexOf(OperatingSystems.macOS) !== -1) return OperatingSystems.macOS
  return OperatingSystems.others
}

export const os = detectOS()

export function friendlyFormatShortcut(shortcut?: string) {
  if (!shortcut) return ''
  if (os === OperatingSystems.Windows) {
    return shortcut.replace(/meta/, 'win')
  } else if (os === OperatingSystems.macOS) {
    return shortcut
      .replace(/meta/, '⌘')
      .replace(/ctrl/, '⌃')
      .replace(/shift/, '⇧')
      .replace(/alt/, '⌥')
      .toUpperCase()
  } else {
    return shortcut
  }
}

/**
 * if item's name matches path, return self-depth of the item
 * else return 0
 */
function measureDistance(item: TreeNode, path: TreeNode['name'][]): number {
  const pathString = path.join('/')
  if (item.name.indexOf(pathString + '/') === 0) {
    // If accessing a leading item of compressed node, path will be shorter than item.name
    return path.length
  } else if (pathString === item.name || pathString.indexOf(item.name + '/') === 0) {
    return item.name.split('/').length
  }
  return 0
}

/**
 * look for the first item matches given path under root.content
 */
export function findNode(
  root: TreeNode,
  path: TreeNode['name'][],
  callback?: (node: TreeNode) => void,
): TreeNode | undefined {
  if (Array.isArray(root.contents)) {
    for (const item of root.contents) {
      const distance = measureDistance(item, path)
      if (distance > 0) {
        if (callback) callback(item)
        if (path.length === distance) return item
        return findNode(item, path.slice(distance), callback)
      }
    }
  }
}

export function createStyleSheet(content: string) {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(content))
  document.head.appendChild(style)
  return style
}

export function setStyleSheetMedia(style: HTMLStyleElement, media: string) {
  style.setAttribute('media', media)
}
