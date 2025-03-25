import React, { useEffect, useRef, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, ColumnDef, flexRender, SortingState } from "@tanstack/react-table";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  last_login: string;
  status: "active" | "blocked";
}

interface UserTableProps {
  users: User[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

const UserTable: React.FC<UserTableProps> = ({ users, selectedIds, setSelectedIds }) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data: users,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  const currentPageIds = table.getRowModel().rows.map((row) => row.original.id);
  const allCurrentSelected = currentPageIds.every((id) => selectedIds.includes(id));
  const someCurrentSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !allCurrentSelected;
  const totalPages = Math.ceil(users.length / pageSize);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someCurrentSelected;
    }
  }, [someCurrentSelected]);

  const toggleUserSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelected = new Set([...selectedIds, ...currentPageIds]);
      setSelectedIds(Array.from(newSelected));
    }
  };

  function getColumns(): ColumnDef<User>[] {
    return [
      {
        id: "select",
        header: () => <input type="checkbox" ref={selectAllRef} checked={allCurrentSelected} onChange={toggleSelectAll} />,
        cell: ({ row }) => <input type="checkbox" checked={selectedIds.includes(row.original.id)} onChange={() => toggleUserSelection(row.original.id)} />,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by Name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Email <ArrowUpDown className="ml-2 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by Email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
      },
      {
        accessorKey: "last_login",
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Last Login <ArrowUpDown className="ml-2 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by Last Login</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: ({ row }) => <div>{formatDate(row.getValue("last_login"))}</div>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: ({ row }) => <span className={`px-2 py-1 rounded ${row.getValue("status") === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{row.getValue("status")}</span>,
        sortingFn: (rowA, rowB) => {
          const statusA = rowA.getValue("status") === "active" ? 1 : 0;
          const statusB = rowB.getValue("status") === "active" ? 1 : 0;
          return statusA - statusB;
        },
      },
    ];
  }

  return (
    <div className="space-y-4">
      {/* {selectedIds.length > 0 && <div className="text-sm text-muted-foreground">{selectedIds.length} selected</div>} */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={selectedIds.includes(row.original.id) ? "bg-muted" : ""}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 bg-gray-100">
        <div className="text-sm text-muted-foreground hidden md:block">
          Page {pageIndex + 1} of {totalPages}
        </div>
        <div className="hidden md:block">{selectedIds.length > 0 && <div className="text-sm text-muted-foreground">{selectedIds.length} selected</div>}</div>
        <div className="flex items-center space-x-2 justify-between w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))} disabled={pageIndex === 0}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageIndex(Math.min(pageIndex + 1, totalPages - 1))} disabled={pageIndex === totalPages - 1}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex === totalPages - 1}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
