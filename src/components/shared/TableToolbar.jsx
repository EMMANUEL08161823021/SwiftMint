'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Columns, Download, Filter, MoreHorizontal, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getProduct, getProducts } from '@/app/(admin)/products/selectors';
import ImportTranslationsDialog from '@/app/(admin)/translations/dialogs/ImportTranslationsDialog/ImportTranslationsDialog';

export function TableToolbar({ table }) {
  const filterableCols = useMemo(
    () =>
      table.getAllLeafColumns().filter((c) => {
        const key = c.columnDef.accessorKey;
        return typeof key === 'string' && key !== 'actions';
      }),
    [table]
  );

  const [filterCol, setFilterCol] = useState(filterableCols[0]?.id ?? '');
  const currentCol = table.getColumn(filterCol);
  const [open, setOpen] = useState(false);

  // mobile filter dialog
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useSelector(getProducts) || [];
  

  // allProducts: array of productName strings, sorted
  const allProducts = useMemo(() => {
    return products
      .map((p) => String(p.productName || '').trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [products]);

  const productsCol = table.getAllLeafColumns().find(c => c.id === 'products' || c.columnDef?.accessorKey === 'products');
  if (!productsCol || !products?.length) return null;
  

  const selectedProducts = (productsCol?.getFilterValue?.() ?? []) || [];

  const toggleProduct = (productName) => {
    if (!productsCol) return;
    const curr = Array.isArray(productsCol.getFilterValue?.())
      ? productsCol.getFilterValue()
      : [];
    const next = curr.includes(productName)
      ? curr.filter((p) => p !== productName)
      : [...curr, productName];
    productsCol.setFilterValue(next.length ? next : undefined);
  };

  const clearProducts = () => {
    productsCol?.setFilterValue?.(undefined);
  };

  // ---------- CSV export ----------
  const exportCSV = () => {
    const columns = table
      .getAllLeafColumns()
      .filter((c) => c.getIsVisible() && c.id !== 'actions');
    const rows = table.getRowModel().rows;
    const header = columns.map((c) =>
      typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id
    );
    const body = rows.map((r) =>
      columns
        .map((c) => {
          const v = r.getValue(c.id);
          return `"${String(v ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agents.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-full sm:max-w-md items-center gap-2">
          <Label className="text-xs shrink-0">Search</Label>
          <Input
            placeholder="Search all columns…"
            className="w-full"
            value={table.getState().globalFilter ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Columns className="h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.id}
                      checked={c.getIsVisible()}
                      onCheckedChange={(v) => c.toggleVisibility(!!v)}
                    >
                      {typeof c.columnDef.header === 'string'
                        ? c.columnDef.header
                        : c.id}
                    </DropdownMenuCheckboxItem>
                  ))}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
              </Button>
              <ImportTranslationsDialog open={open} onOpenChange={setOpen} />
            </DropdownMenu>
            {productsCol && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="flex items-center gap-2">
                      <span>Products</span>
                      {selectedProducts?.length ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted">
                          {selectedProducts.length}
                        </span>
                      ) : null}
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Filter products</div>
                      <button
                        className="text-xs cursor-pointer text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          clearProducts();
                        }}
                      >
                        Clear
                      </button>
                    </div>

                    {allProducts.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No products</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {allProducts.map((productName) => (
                          <DropdownMenuCheckboxItem
                            key={productName}
                            checked={selectedProducts.includes(productName)}
                            onCheckedChange={() => toggleProduct(productName)}
                          >
                            {productName}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* CSV */}
            <Button variant="outline" className="gap-2" onClick={exportCSV}>
              <Download className="h-4 w-4" /> CSV
            </Button>

            {/* Page size */}
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* sm-: collapse actions into one menu to prevent overflow */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* open filter dialog */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>

              {/* columns */}
              <DropdownMenuSeparator />
              {table
                .getAllLeafColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  >
                    {typeof c.columnDef.header === 'string'
                      ? c.columnDef.header
                      : c.id}
                  </DropdownMenuCheckboxItem>
                ))}
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => table.resetVisibility()}
              >
                Reset visibility
              </Button>

              {/* products in mobile menu (same checklist) */}
              {productsCol && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <div className="text-sm font-medium mb-1">Products</div>
                    {allProducts.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No products</div>
                    ) : (
                      allProducts.map((productName) => (
                        <DropdownMenuCheckboxItem
                          key={productName + '-mobile'}
                          checked={selectedProducts.includes(productName)}
                          onCheckedChange={() => toggleProduct(productName)}
                        >
                          {productName}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => clearProducts()}
                      >
                        Clear product filters
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={exportCSV}
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>

              {/* page size (simple) */}
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Label className="text-xs">Rows / page</Label>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(v) => table.setPageSize(Number(v))}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* md+: open filters inline (dialog for mobile below) */}
          <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 hidden sm:flex">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label>Filter column</Label>
                  <Select
                    value={filterCol}
                    onValueChange={(v) => setFilterCol(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Column" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterableCols.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {typeof c.columnDef.header === 'string'
                            ? c.columnDef.header
                            : c.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input
                    placeholder="Value…"
                    value={table.getColumn(filterCol)?.getFilterValue?.() ?? ''}
                    onChange={(e) =>
                      table.getColumn(filterCol)?.setFilterValue?.(e.target.value)
                    }
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                >
                  Reset filters
                </Button>
                <Button onClick={() => setFiltersOpen(false)}>Apply</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
