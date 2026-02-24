'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import {
  Settings2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Download,
} from 'lucide-react';
import { fetchCompaniesProfile } from '@/app/(admin)/companies/(list)/actions';

const slugify = (name = '') =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export function DataTable({
  columns,
  data,
  getRowId,
  initialPageSize = 10,
  pageSizes = [10, 20, 50, 100],
  enableResize = true,
  Toolbar,
  className = '',
  loading = false,
  skeletonRows,
  loadingText = 'Loading...',
}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const dispatch = useDispatch();

  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

  React.useEffect(() => {
    if (!loading) setHasLoadedOnce(true);
  }, [loading]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getRowId,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
    },
    enableColumnResizing: enableResize,
    columnResizeMode: 'onChange',
  });

  const [pageInput, setPageInput] = React.useState('1');
  const pageCount = table.getPageCount() || 1;

  React.useEffect(() => {
    setPageInput(String(table.getState().pagination.pageIndex + 1));
  }, [table.getState().pagination.pageIndex]);

  const goToPage = () => {
    const n = Math.max(1, Math.min(Number(pageInput) || 1, pageCount));
    table.setPageIndex(n - 1);
  };

  // navigate helper: derive a slug from row data and push
  const navigateToCompany = (row) => {
    const companyId = row.original._id;
    const companyName = row.original.companyName;

    dispatch(fetchCompaniesProfile(companyId));
    if (!companyName) return;
    const slug = slugify(companyName);
    router.push(`/companies/${slug}`);
  };

  const onUnlock = (e) => {
    e.stopPropagation();
    dispatch(fetchCompaniesProfile(companyId));
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {Toolbar ? (
        <Toolbar table={table} />
      ) : (
        <DefaultToolbar
          table={table}
          pageSizes={pageSizes}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          loading={loading}
          loadingText={loadingText}
        />
      )}

      <div className="h-[510px] overflow-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const size = header.getSize?.();
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: size }}
                      className="relative group whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-transparent group-hover:bg-muted-foreground/30"
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({
                length: skeletonRows ?? table.getState().pagination.pageSize,
              }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="h-[68px]">
                  {table.getAllLeafColumns().map((col) => (
                    <TableCell key={`${col.id}-${i}`}>
                      <div className="h-4 w-full max-w-[220px] animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-[68px] border cursor-pointer hover:bg-slate-50"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateToCompany(row);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize?.() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : hasLoadedOnce ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="text-center py-10"
                >
                  No results
                </TableCell>
              </TableRow>
            ) : (
              Array.from({
                length: skeletonRows ?? table.getState().pagination.pageSize,
              }).map((_, i) => (
                <TableRow key={`pre-sk-${i}`} className="h-[68px]">
                  {table.getAllLeafColumns().map((col) => (
                    <TableCell key={`${col.id}-pre-${i}`}>
                      <div className="h-4 w-full max-w-[220px] animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination row */}
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* page size */}
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* pager */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          {/* go to page */}
          <div className="ml-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Go to</span>
            <Input
              className="h-8 w-16"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToPage()}
            />
            <Button variant="outline" className="h-8" onClick={goToPage}>
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultToolbar({
  table,
  pageSizes,
  globalFilter,
  setGlobalFilter,
  loading,
  loadingText,
}) {
  const exportCSV = React.useCallback(() => {
    const cols = table
      .getAllLeafColumns()
      .filter((c) => c.getIsVisible() && c.id !== 'actions');
    const rows = table.getRowModel().rows;
    const header = cols.map((c) =>
      typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id
    );
    const body = rows.map((r) =>
      cols
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
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [table]);

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Global search */}
        <Input
          placeholder={loading ? loadingText : 'Search all columns…'}
          className="w-full sm:max-w-md"
          value={globalFilter ?? ''}
          disabled={loading}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" disabled={loading}>
                <Settings2 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllLeafColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    disabled={loading}
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

          {/* CSV Export */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={exportCSV}
            disabled={loading}
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
