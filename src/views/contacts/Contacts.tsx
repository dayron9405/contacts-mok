import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { FetchResult } from "../../core/interfaces/fetchResult.interface";
import { IResponseContacts } from "./interfaces/contacts.interface";
import { envs } from "../../core/environments/environments";
import TableGeneric from "../../shared/components/table-generic/TableGeneric";
import { IColumn } from "../../shared/components/table-generic/interfaces/TableGeneric.interface";

const Contacts = () => {
  const [ page, setPage ] = useState(1);
  const [ limit, setLimit ] = useState(10);
  const [ data, setData ] = useState<any[]>([]);
  const baseUrl = envs.baseUrl;
  const { response, loading, error }: FetchResult<IResponseContacts> = useFetch(`${baseUrl}`, { page, limit });

  useEffect(() => {
    if (response.results.length > 0) {
      setData([...data, ...response.results])
    }
  }, [response])
  
  const columns: IColumn[] = [
    {
      type: 'img',
      key: 'picture.thumbnail',
      label: 'Foto',
    },
    {
      type: 'text',
      key: 'name.first',
      label: 'Nombre',
      orderBy: 'ASC',
    },
    {
      type: 'text',
      key: 'name.last',
      label: 'Apellido',
      orderBy: 'ASC',
    },
    {
      type: 'text',
      key: 'gender',
      label: 'Genero',
      orderBy: 'ASC',
    },
    {
      type: 'text',
      key: 'location.country',
      label: 'Pais',
      orderBy: 'ASC',
    },
  ]
  const filter: IColumn = {
    type: 'text',
    key: 'location.country',
    label: 'Pais',
    orderBy: 'ASC',
  }

  return (
    <div className="contacts">
      <TableGeneric 
        columns={columns}  
        data={data || []}
        filter={filter}
        page={page}
        limit={limit}
        title={'Lista de contactos'} 
        path={baseUrl}
      />
    </div>
  );
};

export default Contacts;
