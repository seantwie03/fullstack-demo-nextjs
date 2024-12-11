"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Trip } from "lib/schema";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Trip>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("start_date"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("end_date"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("Edit trip", trip)}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
