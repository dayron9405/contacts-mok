import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IColumn, ITableGeneric } from "./interfaces/TableGeneric.interface";

const renderValue = (obj: any, targetKey: string): string => {
  if (!obj || typeof obj !== "object") {
    return "";
  }
  const keys = targetKey.split(".");
  const currentKey = keys[0];
  const remainingKeys = keys.slice(1).join(".");
  if (!(currentKey in obj)) {
    return "";
  }
  if (remainingKeys === "") {
    return obj[currentKey];
  } else {
    return renderValue(obj[currentKey], remainingKeys);
  }
};

const TableGeneric: React.FC<ITableGeneric> = ({
  title,
  columns,
  data,
  filter
}) => {
  const [tableStyle, setTableStyle] = useState<"ligth" | "dark">("ligth");
  const [filterValue, setFilterValue] = useState("");
  const [filterColumn, setFilterColumn] = useState<IColumn>(filter);
  const [columnsTable, setColumnsTable] = useState<IColumn[]>(columns);
  const memoDataTable = useMemo<any[]>(() => {
    const processedData = data.map((item, inx) => {
      const dataMemo = columns.map((column, inxCol) => {
        if (column.type === "img") {
          return {
            src: renderValue(item, column.key),
            alt: "img-" + inx + renderValue(item, column.key),
          };
        } else {
          return {
            [column.key]: renderValue(item, column.key),
          };
        }
      });
      return dataMemo;
    });
    return processedData;
  }, [data,columns]);
  const [dataTable, setDataTable] = useState(memoDataTable);
  const [inxFilter, setInxFilter] = useState(0);

  useEffect(() => {
    setDataTable(memoDataTable);
  }, [memoDataTable]);

  useEffect(() => {
    const inxCol = columns.findIndex(item => JSON.stringify(item) === JSON.stringify(filterColumn));
    setInxFilter(inxCol);
  }, [columns])

  useEffect(() => {
    filterTable();
  }, [filterValue])

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setFilterValue(value);
  };

  const filterTable = () => {
    const newData = [...memoDataTable];
    const dataEnd = newData.filter((item) => {
      const current = item[inxFilter][columnsTable[inxFilter].key].toLowerCase()
      return current.includes(filterValue.toLowerCase())
    });
    setDataTable(dataEnd);
  }

  const deleteItem = async (inx: number) => {
    const newData = [...dataTable];
    newData.splice(inx, 1);
    setDataTable(newData);
    // deleteRow && deleteRow(item)
  };

  const changeStyle = () => {
    setTableStyle(tableStyle === "ligth" ? "dark" : "ligth");
  };

  const tableStyleEven = {
    dark: "bg-even text-white",
    ligth: "bg-white text-black",
  };

  const tableStyleOdd = {
    dark: "bg-odd text-white",
    ligth: "bg-white text-black",
  };

  const buttonStyle = {
    dark: 'bg-secondary hover:bg-secondaryHover',
    ligth: 'bg-primary hover:bg-primaryHover'
  }

  const orderByFilter = () => {
    const newValueFilter = {...filterColumn};
    newValueFilter?.orderBy === "ASC"
      ? (newValueFilter.orderBy = "DESC")
      : (newValueFilter.orderBy = "ASC");
    setFilterColumn(newValueFilter);
    changeOrderBy(inxFilter);
  }

  const changeOrderBy = (inx: number): void => {
    const newValue = [...columnsTable];
    newValue[inx].orderBy === "ASC"
      ? (newValue[inx].orderBy = "DESC")
      : (newValue[inx].orderBy = "ASC");
    restoreOrderBy(inx, newValue, false);
    setColumnsTable([...newValue]);
    const newDataTable = [...dataTable];
    newValue[inx].orderBy === "ASC"
      ? sortASC(inx, newValue, newDataTable)
      : sortDESC(inx, newValue, newDataTable);
  };

  const restoreOrderBy = (inx: number, newValue: IColumn[], all: boolean) => {
    newValue.forEach((item, i) => {
      if ((i !== inx && newValue[i].orderBy) || (all && newValue[i].orderBy)) {
        newValue[i].orderBy = "ASC";
      }
      return item;
    });
  };

  const sortASC = (inx: number, newValue: IColumn[], newDataTable: any[]) => {
    newDataTable.sort((a, b) => {
      return a[inx][newValue[inx].key].localeCompare(b[inx][newValue[inx].key]);
    });
    setDataTable(newDataTable);
  };

  const sortDESC = (inx: number, newValue: IColumn[], newDataTable: any[]) => {
    newDataTable.sort((a, b) => {
      return b[inx][newValue[inx].key].localeCompare(a[inx][newValue[inx].key]);
    });
    setDataTable(newDataTable);
  };

  const restart = () => {
    setFilterValue('');
    restoreOrderBy(0, columnsTable, true);
    setDataTable(memoDataTable);
  };

  return (
    <div className="TableGeneric m-4">
      <h2 className="m-4 font-semibold text-2xl">{title}</h2>
      <div className="m-4 flex justify-between items-center">
        <div className="w-3/6 flex justify-start items-center">
          <button
            className="flex  justify-center items-center bg-primary w-3/6 hover:bg-primaryHover text-white font-semibold m-2 py-2 px-4 rounded-full shadow"
            onClick={orderByFilter}
          >
            <span className="mx-1"> Ordenar por { filter?.label }</span>
            <span
              className="cursor-pointer mx-1"
            >
              {filterColumn?.orderBy === "ASC" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M17 14l-5-5-5 5z" />
                </svg>
              )}
            </span>
          </button>
          <input
            className="placeholder:text-slate-400 border-slate-300 focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 m-2 p-3 rounded-full py-2 pl-9 pr-3 placeholder:italic w-full border block shadow-sm sm:text-sm"
            type="text"
            placeholder={"Filtrar por" + filter?.label}
            name={filter?.label}
            value={filterValue}
            onChange={handleChange}
          />
        </div>
        <div className="flex  justify-end items-center">
          <button
            className="flex justify-center items-center bg-primary hover:bg-primaryHover text-white font-semibold m-2 py-2 px-4 rounded-full shadow"
            onClick={restart}
          >
            <span className="mx-1">Restaurar datos</span>
            <span className="mx-1">
            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
              <path d="M451-122q-123-10-207-101t-84-216q0-77 35.5-145T295-695l43 43q-56 33-87 90.5T220-439q0 100 66 173t165 84v60Zm60 0v-60q100-12 165-84.5T741-439q0-109-75.5-184.5T481-699h-20l60 60-43 43-133-133 133-133 43 43-60 60h20q134 0 227 93.5T801-439q0 125-83.5 216T511-122Z" fill="#ffffff"/>
            </svg>
            </span>
          </button>
          <button
            className={"flex justify-center items-center text-white font-semibold m-2 py-2 px-4 rounded-full shadow " + buttonStyle[tableStyle]}
            onClick={changeStyle}
          >
            <span className="mx-1">Cambiar estilo</span>
            <span className="mx-1">
              <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-85 32-158t87.5-127q55.5-54 130-84.5T489-880q79 0 150 26.5T763.5-780q53.5 47 85 111.5T880-527q0 108-63 170.5T650-294h-75q-18 0-31 14t-13 31q0 27 14.5 46t14.5 44q0 38-21 58.5T480-80Zm0-400Zm-233 26q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm126-170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm214 0q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm131 170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15ZM480-140q11 0 15.5-4.5T500-159q0-14-14.5-26T471-238q0-46 30-81t76-35h73q76 0 123-44.5T820-527q0-132-100-212.5T489-820q-146 0-247.5 98.5T140-480q0 141 99.5 240.5T480-140Z" fill="#ffffff"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className="m-4 overflow-x-auto rounded-xl">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead className="bg-gray-100">
            <tr>
              {columnsTable.map((column, inx) => (
                <th
                  key={inx}
                  className="text-start py-3 px-6 font-semibold uppercase text-sm text-gray-700 border-b"
                >
                  <div
                    className={
                      "flex items-center " +
                      (inx === 0 ? "justify-start" : "justify-center")
                    }
                  >
                    <span>{column.label}</span>
                    {column.orderBy ? (
                      <span
                        className="cursor-pointer"
                        onClick={() => changeOrderBy(inx)}
                      >
                        {column.orderBy === "ASC" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="20"
                            height="20"
                          >
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="20"
                            height="20"
                          >
                            <path d="M17 14l-5-5-5 5z" />
                          </svg>
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </th>
              ))}
              <th className="text-end py-3 px-6 font-semibold uppercase text-sm text-gray-700 border-b">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {dataTable.map((item, inx) => (
              <tr
                key={inx}
                className={
                  inx % 2 === 0
                    ? tableStyleOdd[tableStyle]
                    : tableStyleEven[tableStyle]
                }
              >
                {columns.map((column, inxCol) => (
                  <td key={inxCol} className="py-4 px-6 border-b">
                    {column.type === "img" ? (
                      <div className="w-full flex justify-start items-center">
                        <img
                          style={{ maxWidth: "100%", height: "auto" }}
                          src={item[inxCol].src}
                          alt={item[inxCol].alt}
                        />
                      </div>
                    ) : (
                      item[inxCol][column.key]
                    )}
                  </td>
                ))}
                <td className="py-4 px-6 border-b flex justify-end items-center">
                <button
                  name="delete"
                  className="m-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md focus:outline-none"
                  onClick={() => deleteItem(inx)}
                  aria-label="Eliminar ítem"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
                  </svg>
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableGeneric;
