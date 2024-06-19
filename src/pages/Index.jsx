import React, { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("edited_data.csv");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(Object.keys(result.data[0]));
          setData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (e, rowIndex, header) => {
    const newData = [...data];
    newData[rowIndex][header] = e.target.value;
    setData(newData);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, index) => (
                    <TableCell key={index}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleInputChange(e, rowIndex, header)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4 mr-2">
            Add Row
          </Button>
          <CSVLink data={data} headers={headers} filename={fileName} className="mt-4 ml-2">
            <Button>Download CSV</Button>
          </CSVLink>
        </>
      )}
    </div>
  );
};

export default Index;