import { AgGridReact } from "ag-grid-react";
import { useLocalState } from "../utli/useLocalStorage";
import axios from "axios";
import { useState } from "react";
import { Authenticate, Logout } from "./TextilAuth";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


async function ModSAPExist(modExist) {
  try {
    const authToken = await Authenticate();

    const url = `https://192.168.246.228:50000/b1s/v1/Items/$count?$filter= startswith( ItemCode ,'${modExist}')`;

    if (authToken === 200) {
      const response = await axios.get(url, { withCredentials: true });

      return response.data;
    } else {
      return "0";
    }
  } catch (error) {
    console.log("Modelo existe", error);
    throw error; // Manejo de excepciones para propagar errores hacia arriba en la pila de llamadas
  } finally {
    await Logout();
    console.log("Modelo existe logout");
  }
}

function MyTableData({
  codetipoanexo,
  sa_tipoanexo,
  data,
  resetForm,
  handleGetClick,
  resetOrigin,
  handleSaveImage,
  selectedImage,
}) {
  const [gridOptions, setGridOptions] = useState({
    defaultColDef: {
      //resizable: true,
    },
    columnDefs: [
      { headerName: "Anexo", field: "sa_anexo", resizable: true },
      { headerName: "PO", field: "sa_po", resizable: true },
      { headerName: "REF. PROV.", field: "suppliercatalogno", resizable: true },
      { headerName: "CodeProv", field: "cardcode", resizable: true },
      { headerName: "NameProv", field: "sa_namecardcode", resizable: true },
      { headerName: "Pais", field: "u_argns_coo", resizable: true },
      {
        headerName: "Composicion",
        field: "u_argns_int_compii",
        resizable: true,
      },
      { headerName: "Año", field: "u_argns_year", resizable: true },

      { headerName: "Bodega", field: "defaultwarehouse", resizable: true },
      { headerName: "Code Color", field: "u_argns_col", resizable: true },
      { headerName: "Name Color", field: "sa_color", resizable: true },
      {
        headerName: "Code Tipo BM",
        field: "u_argns_int_tipo_b_m",
        resizable: true,
      },
      { headerName: "Name Tipo BM", field: "sa_nametipo_b_m", resizable: true },
      {
        headerName: "Code Estilo",
        field: "u_argns_int_estilo",
        resizable: true,
      },
      { headerName: "Name Estilo", field: "sa_nameestilo", resizable: true },

      { headerName: "Code Genero", field: "u_argns_div", resizable: true },
      { headerName: "Name Genero", field: "sa_namegenero", resizable: true },
      { headerName: "Descu", field: "u_cxs_sldc", resizable: true },

      { headerName: "Marca", field: "sa_codmarcacodi", resizable: true },
      { headerName: "Name Marca", field: "sa_namemarcacodi", resizable: true },
      { headerName: "MarcaExt", field: "u_argns_brand", resizable: true },
      {
        headerName: "Name MarcaExt",
        field: "sa_namemarcaext",
        resizable: true,
      },
      { headerName: "Proced", field: "u_argns_int_proced", resizable: true },

      {
        headerName: "Code Familia",
        field: "u_argns_int_flia",
        resizable: true,
      },
      { headerName: "Name Familia", field: "sa_namefamilia", resizable: true },
      { headerName: "SubFamilia", field: "u_argns_int_sflia", resizable: true },
      {
        headerName: "NameSubFamilia",
        field: "sa_namesubfamilia",
        resizable: true,
      },
      {
        headerName: "Code Cuerpo",
        field: "u_argns_int_cuerpo",
        resizable: true,
      },
      { headerName: "Name Cuerpo", field: "sa_namecuerpo", resizable: true },
      { headerName: "Modelo", field: "uargnsmod", resizable: true },
      {
        headerName: "Code TipoMod",
        field: "u_argns_int_tipo_mod",
        resizable: true,
      },
      {
        headerName: "Name TipoMod",
        field: "sa_nametipomodelo",
        resizable: true,
      },
      { headerName: "Code Grupo", field: "itmsgrpcod", resizable: true },
      { headerName: "Name Grupo", field: "sa_nameitmsgrpcod", resizable: true },

      { headerName: "Escala", field: "u_argns_scl", resizable: true },
      { headerName: "Tallas", field: "u_argns_size", resizable: true },
      //CANTIDAD Y PRECIOS
      {
        headerName: "Cantidad",
        field: "onhand",
        resizable: true,
        editable: true,
      },
      {
        headerName: "Costo",
        field: "sa_preciouni",
        resizable: true,
        editable: true,
      },
      {
        headerName: "PrecioSinIVA",
        field: "price",
        resizable: true,
        editable: true,
      },
      {
        headerName: "Precio X Mayor",
        field: "sa_ppmxmayor",
        resizable: true,
        editable: true,
      },
      {
        headerName: "PrecioConIVA",
        valueGetter: (params) => {
          //const cantidad = params.data.onhand;
          const precio = params.data.price;
          const precioConIVA = 1.12 * precio;
          return precioConIVA.toFixed(2);
        },
        resizable: true,
        field: "sa_pvpconiva",
        editable: false,
        //cellClass: 'total-col',
      },

      { headerName: "ItemCode", field: "itemcode", resizable: true },
      { headerName: "ItemName", field: "itemname", resizable: true },
    ],
    onColumnResized: (params) => {
      console.log(params);
    },
  });

  const [user, setUser] = useLocalState("", "user");
  //const [codetipoanexo, setCodeTipoAnexo] = useState("01");

  const onGridReady = (params) => {
    setGridOptions((prevState) => ({
      ...prevState,
      api: params.api,
      columnApi: params.columnApi,
    }));
    params.api.sizeColumnsToFit();
  };

  function autoSizeAll() {
    const allColumnIds = gridOptions.columnApi
      .getAllColumns()
      .map((column) => column.getColId());
    gridOptions.columnApi.autoSizeColumns(allColumnIds);
  }

  async function handleSave() {

   

    const rowData = [];
    gridOptions.api.forEachNode((node) => rowData.push(node.data));

    if (rowData.length===0) {
      return;
    }

    //VERIFICAR SI YA EXISTE EL CAMPO uargnsmod
    const [modSAPExist, response] = await Promise.all([
      ModSAPExist(rowData[0].uargnsmod),
      axios.get(`/api/v1/anexos/cxm/${rowData[0].uargnsmod}`),
    ]);

    if (modSAPExist > 0 || response.data > 0) {
      alert(`Ya existe el Modelo ${rowData[0].uargnsmod}`);
      return null;
    }

    const emptyFields = rowData.filter(
      (data) =>
        !data.sa_anexo ||
        !data.uargnsmod ||
        !data.suppliercatalogno ||
        !data.itmsgrpcod
    );

    const emptyFieldsSet = new Set();
    emptyFields.forEach((field) => {
      if (!field.itmsgrpcod) {
        emptyFieldsSet.add(
          "El grupo de articulo no existe, revisar Marca y Procedencia"
        );
      }
      if (!field.sa_anexo) {
        emptyFieldsSet.add("Anexo está vacío");
      }
      if (!field.uargnsmod) {
        emptyFieldsSet.add("Modelo está vacío");
      }
      if (!field.suppliercatalogno) {
        emptyFieldsSet.add("Ref. Prov. está vacío");
      }
    });

    const emptyFieldsMsg = Array.from(emptyFieldsSet);
    if (emptyFieldsMsg.length > 0) {
      alert("Campos vacíos\nRevisar: " + emptyFieldsMsg.join(", "));
      return;
    }

    const promises = rowData.map(async (data) => {
      data.sa_pvpconiva = parseFloat((1.12 * data.price).toFixed(2));

      /**
       * CAMPOS POR DEFAULT
       */

      data.username = user;
      data.sa_codetipoanexo = codetipoanexo;
      data.sa_tipoanexo = sa_tipoanexo;
      data.barcode = "";
      data.foreignname = "";
      data.itemtype = "Y";
      data.vatliable = "Y";
      data.purchaseitem = "Y";
      data.salesitem = "Y";
      data.inventoryitem = "Y";
      data.assetitem = "N";
      data.manageserialnumbers = "N";
      data.managebatchnumbers = "N";
      data.glmethod = "C";
      data.managestockbywarehouse = "Y";
      data.wtliable = "Y";
      data.costaccountingmethod = "A";
      data.planningsystem = "N";
      data.procurementmethod = "B";
      data.orderintervals = null;
      data.ordermultiple = 0;
      data.leadtime = "";
      data.minorderquantity = 0;
      data.itemtype = "I";
      data.uomgroupentry = "1";
      data.inventoryuomentry = "1";
      data.defaultsalesuomentry = "1";
      data.defaultpurchasinguomentry = "1";
      data.u_tipo_bien = "B";
      data.u_argns_sizevo = "";
      data.u_argns_var = "";
      data.u_argns_appgrp = "";
      data.u_argns_m_group = "";
      data.u_argns_m_type = "";
      data.u_argns_linecode = "";
      data.u_argns_int_dibujo = "";
      data.u_argns_int_cuello = "";
      data.u_argns_int_puno = "";
      data.u_argns_int_perso = "";
      data.u_cxs_reit = "Y";

      data.sa_enviadosap = "N";

      /**
       * CAMPOS POR DEFAULT
       */

      return axios.post("/api/v1/anexos", data);
    });

    Promise.all(promises)
      .then((responses) => {
        console.log(responses);
        resetForm();
        handleGetClick(user, codetipoanexo);
        resetOrigin(); 
        handleSaveImage(selectedImage);
        alert("Guardado !!!");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <button onClick={handleSave} className="custom-button">Guardar</button>
      <div className="ag-theme-alpine" style={{ height: 250, width: "99vw" }}>
        <AgGridReact
          rowData={data}
          columnDefs={gridOptions.columnDefs}
          onGridReady={onGridReady}
          onFirstDataRendered={autoSizeAll}
        />
      </div>
    </div>
  );
}

export default MyTableData;
