// ----------------------------------------------------------------------

export function rowInPage<T>(data: T[], page: number, rowsPerPage: number) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

/**
 * @example
 * const data = {
 *   calories: 360,
 *   align: 'center',
 *   more: {
 *     protein: 42,
 *   },
 * };
 *
 * const ex1 = getNestedProperty(data, 'calories');
 * console.log('ex1', ex1); // output: 360
 *
 * const ex2 = getNestedProperty(data, 'align');
 * console.log('ex2', ex2); // output: center
 *
 * const ex3 = getNestedProperty(data, 'more.protein');
 * console.log('ex3', ex3); // output: 42
 */
function getNestedProperty(obj: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value === null || typeof value !== 'object') return undefined;
    return Reflect.get(value, part);
  }, obj);
}

function descendingComparator(a: object, b: object, orderBy: string) {
  const aValue = getNestedProperty(a, orderBy);
  const bValue = getNestedProperty(b, orderBy);

  if (aValue === bValue) return 0;
  if (aValue === null || aValue === undefined) return 1;
  if (bValue === null || bValue === undefined) return -1;
  if (typeof aValue === 'number' && typeof bValue === 'number') return bValue - aValue;

  const aText = String(aValue);
  const bText = String(bValue);
  return bText < aText ? -1 : bText > aText ? 1 : 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends PropertyKey>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: object, b: object) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, String(orderBy))
    : (a, b) => -descendingComparator(a, b, String(orderBy));
}
