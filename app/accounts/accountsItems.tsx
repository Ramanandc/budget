"use client";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AccountItem({ account }: { account: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async (accountId : any) => {
    setIsDeleting(true);
    try {
      await fetch("/api/accounts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: accountId,
        }),
      });
      // Optionally, you can refresh the page or update the UI after deletion.
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      router.refresh();
      toast.success("Account Deleted Successfully");
    }
  };

  const colDefs = [
    { headerName: "Account Name", field: "accountName" },
    { headerName: "Account No", field: "accountNo" },
    { headerName: "Account IFCCODE", field: "accountIfccode" },
    { headerName: "Account Branch", field: "accountBranch" },
    { headerName: "Account Balance", field: "accountBalance" },
    {
      headerName: "Action",
      cellRenderer: function (params: any) {
        return (
          <button
            onClick={() => handleDelete(
              params.data.accountId
            )}
            
            disabled={isDeleting}
            className="text-red-600 dark:text-red-400"
          >
            Delete 
          </button>
        );
      },
    },
  ];

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: 750 }} // the Data Grid will fill the size of the parent container
    >
      {" "}
      <AgGridReact
        gridOptions={{
          defaultColDef: {
            flex: 1,
            minWidth: 150,
            sortable: true,
            filter: true,
          },
        }}
        rowHeight={60}
        rowData={account}
        columnDefs={colDefs}
      />
    </div>
  );
}
