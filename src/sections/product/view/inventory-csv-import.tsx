'use client';

import type { ProductCsvRow } from '@/types/product';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Upload } from '@/components/upload';
import { toast } from '@/components/snackbar';
import { importInventoryProductsAction } from '@/app/dashboard/inventory/actions';
import { parseProductCsv } from '@/utils/parse-product-csv';

const CSV_TEMPLATE = [
  'sku,name,category,price,cost_price,stock_quantity,min_stock,cover_url,description,is_active',
  'SKU-001,Sample product,,10.00,6.00,20,5,,Example product,true',
].join('\r\n');

type ParseState = {
  rows: ProductCsvRow[];
  errors: string[];
};

export function InventoryCsvImport() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParseState | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDrop = async (files: File[]) => {
    const nextFile = files[0];
    if (!nextFile) return;

    setFile(nextFile);
    setParsed(null);
    try {
      const result = parseProductCsv(await nextFile.text());
      setParsed(result);
    } catch (error) {
      console.error('Failed to read inventory CSV:', error);
      setParsed({ rows: [], errors: ['Unable to read this CSV file.'] });
    }
  };

  const handleImport = async () => {
    if (!parsed || parsed.errors.length || !parsed.rows.length) return;
    setIsImporting(true);

    try {
      const result = await importInventoryProductsAction(parsed.rows);
      if (!result.success) {
        setParsed((current) => ({
          rows: current?.rows ?? [],
          errors: result.rowErrors ?? [result.error],
        }));
        return;
      }

      toast.success(`${result.inserted} products imported.`);
      setFile(null);
      setParsed(null);
      router.refresh();
    } catch (error) {
      console.error('Inventory CSV import failed:', error);
      toast.error('The import could not be completed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setParsed(null);
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Import products from CSV</Typography>
          <Typography variant="body2" color="text.secondary">
            CSV must include SKU, name and price. Category values must match an existing global
            category name or slug.
          </Typography>
        </Box>
        <Button
          component="a"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`}
          download="inventory-products-template.csv"
          size="small"
          color="inherit"
        >
          Download template
        </Button>
      </Stack>

      <Upload
        value={file}
        onDrop={handleDrop}
        onDelete={handleRemove}
        accept={{ 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv'] }}
        maxSize={512_000}
        maxFiles={1}
        multiple={false}
        helperText="CSV files only, maximum 512 KB and 1,000 products."
      />

      {parsed && (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {parsed.errors.length ? (
            <Alert severity="error">
              <Typography variant="subtitle2">CSV needs attention</Typography>
              <Box component="ul" sx={{ my: 0.5, pl: 2.5 }}>
                {parsed.errors.slice(0, 20).map((error, index) => (
                  <li key={`${index}-${error}`}>
                    <Typography variant="body2">{error}</Typography>
                  </li>
                ))}
                {parsed.errors.length > 20 && (
                  <li>
                    <Typography variant="body2">
                      And {parsed.errors.length - 20} more issue(s).
                    </Typography>
                  </li>
                )}
              </Box>
            </Alert>
          ) : (
            <>
              <Alert severity="success">
                {parsed.rows.length} product{parsed.rows.length === 1 ? '' : 's'} ready to import
                {file ? ` from ${file.name}` : ''}. This import will not overwrite existing products.
              </Alert>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsed.rows.slice(0, 5).map((row, index) => (
                      <TableRow key={`${row.sku}-${index}`}>
                        <TableCell>{row.sku}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category || 'Uncategorized'}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.stockQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {parsed.rows.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  Showing the first 5 products.
                </Typography>
              )}
            </>
          )}

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={isImporting || parsed.errors.length > 0 || !parsed.rows.length}
            >
              {isImporting ? 'Importing…' : `Import ${parsed.rows.length} products`}
            </Button>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}
