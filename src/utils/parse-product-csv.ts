import type { ProductCsvRow } from '@/types/product';

type CsvRecord = {
  fields: string[];
  line: number;
};

export type ProductCsvParseResult = {
  rows: ProductCsvRow[];
  errors: string[];
};

const HEADER_ALIASES: Record<string, keyof ProductCsvRow> = {
  sku: 'sku',
  name: 'name',
  productname: 'name',
  category: 'category',
  categoryid: 'category',
  price: 'price',
  unitprice: 'price',
  costprice: 'costPrice',
  stockquantity: 'stockQuantity',
  quantity: 'stockQuantity',
  minstock: 'minStock',
  reorderlevel: 'minStock',
  coverurl: 'coverUrl',
  imageurl: 'coverUrl',
  description: 'description',
  isactive: 'isActive',
  active: 'isActive',
};

const REQUIRED_HEADERS: Array<keyof ProductCsvRow> = ['sku', 'name', 'price'];
const MAX_CSV_CHARS = 512_000;
const MAX_ROWS = 1000;

function parseRecords(csv: string): CsvRecord[] | string {
  const records: CsvRecord[] = [];
  let fields: string[] = [];
  let field = '';
  let insideQuotes = false;
  let afterQuote = false;
  let line = 1;
  let recordLine = 1;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (insideQuotes) {
      if (character === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          insideQuotes = false;
          afterQuote = true;
        }
      } else if (character === '\r' || character === '\n') {
        if (character === '\r' && csv[index + 1] === '\n') index += 1;
        field += '\n';
        line += 1;
      } else {
        field += character;
      }
      continue;
    }

    if (afterQuote && character !== ',' && character !== '\r' && character !== '\n') {
      if (character !== ' ' && character !== '\t') {
        return `Line ${line}: unexpected character after a quoted field.`;
      }
      continue;
    }

    if (character === '"') {
      if (field.trim()) return `Line ${line}: unexpected quote in an unquoted field.`;
      insideQuotes = true;
    } else if (character === ',') {
      fields.push(field.trim());
      field = '';
      afterQuote = false;
    } else if (character === '\r' || character === '\n') {
      fields.push(field.trim());
      if (fields.some(Boolean)) records.push({ fields, line: recordLine });
      fields = [];
      field = '';
      afterQuote = false;
      if (character === '\r' && csv[index + 1] === '\n') index += 1;
      line += 1;
      recordLine = line;
    } else {
      field += character;
    }
  }

  if (insideQuotes) return `Line ${recordLine}: unclosed quoted field.`;

  fields.push(field.trim());
  if (fields.some(Boolean)) records.push({ fields, line: recordLine });

  return records;
}

function parseInteger(value: string, field: string, line: number): number | string {
  if (!value) return 0;
  if (!/^\d+$/.test(value)) return `Line ${line}: ${field} must be a whole non-negative number.`;

  const number = Number(value);
  if (!Number.isSafeInteger(number) || number > 2_147_483_647) {
    return `Line ${line}: ${field} is outside the supported range.`;
  }

  return number;
}

function parseActive(value: string, line: number): boolean | string {
  if (!value) return true;

  switch (value.toLowerCase()) {
    case 'true':
    case 'yes':
    case '1':
    case 'active':
      return true;
    case 'false':
    case 'no':
    case '0':
    case 'inactive':
      return false;
    default:
      return `Line ${line}: is_active must be true/false, yes/no, 1/0, or active/inactive.`;
  }
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[\s_-]/g, '');
}

export function parseProductCsv(csv: string): ProductCsvParseResult {
  const source = csv.replace(/^\uFEFF/, '');
  if (!source.trim()) return { rows: [], errors: ['The CSV file is empty.'] };
  if (source.length > MAX_CSV_CHARS) {
    return { rows: [], errors: ['CSV files must be 512 KB or smaller.'] };
  }

  const records = parseRecords(source);
  if (typeof records === 'string') return { rows: [], errors: [records] };
  if (records.length < 2) {
    return { rows: [], errors: ['Include a header row and at least one product.'] };
  }

  const headerRecord = records[0];
  const headers: Array<keyof ProductCsvRow | null> = [];
  const seenHeaders = new Set<keyof ProductCsvRow>();
  const errors: string[] = [];

  headerRecord.fields.forEach((field, index) => {
    const header = HEADER_ALIASES[normalizeHeader(field)] ?? null;
    if (!header) {
      errors.push(`Line ${headerRecord.line}: unsupported column "${field}".`);
      return;
    }
    if (seenHeaders.has(header)) {
      errors.push(`Line ${headerRecord.line}: duplicate column "${field}".`);
      return;
    }
    seenHeaders.add(header);
    headers[index] = header;
  });

  REQUIRED_HEADERS.forEach((header) => {
    if (!seenHeaders.has(header)) {
      errors.push(`CSV is missing the required "${header}" column.`);
    }
  });
  if (errors.length) return { rows: [], errors };

  const dataRecords = records.slice(1);
  if (dataRecords.length > MAX_ROWS) {
    return { rows: [], errors: [`Import up to ${MAX_ROWS} products at a time.`] };
  }

  const rows: ProductCsvRow[] = [];

  dataRecords.forEach(({ fields, line }) => {
    if (fields.length > headers.length) {
      errors.push(`Line ${line}: row has more values than the header.`);
      return;
    }

    const record = new Map<keyof ProductCsvRow, string>();
    headers.forEach((header, index) => {
      if (header) record.set(header, fields[index] ?? '');
    });

    const stockQuantity = parseInteger(record.get('stockQuantity') ?? '', 'stock_quantity', line);
    const minStock = parseInteger(record.get('minStock') ?? '', 'min_stock', line);
    const isActive = parseActive(record.get('isActive') ?? '', line);

    if (typeof stockQuantity === 'string') errors.push(stockQuantity);
    if (typeof minStock === 'string') errors.push(minStock);
    if (typeof isActive === 'string') errors.push(isActive);
    if (
      typeof stockQuantity === 'string' ||
      typeof minStock === 'string' ||
      typeof isActive === 'string'
    ) {
      return;
    }

    rows.push({
      sku: record.get('sku') ?? '',
      name: record.get('name') ?? '',
      category: record.get('category') ?? '',
      price: record.get('price') ?? '',
      costPrice: record.get('costPrice') ?? '',
      stockQuantity,
      minStock,
      coverUrl: record.get('coverUrl') ?? '',
      description: record.get('description') ?? '',
      isActive,
    });
  });

  return { rows, errors };
}
