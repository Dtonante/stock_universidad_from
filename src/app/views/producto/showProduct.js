
import ExportPDFButton from 'app/components/product/ExportPDFButton';
import { Modal, TextField } from '@mui/material';
import CompCreateProduct from './createProduct';
import CompEditProduct from './editProduct';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Box, Icon, Table, styled, TableRow, TableBody, TableCell, TableHead, IconButton, Button, TablePagination } from "@mui/material";

// URIs
const URI = 'http://localhost:3001/api/productos/all';
const URI_GET_PRODUCT = 'http://localhost:3001/api/productos/productos'; 
const URI_DELETE = 'http://localhost:3001/api/productos/delete/';

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
}));

const CompShowProducts = () => {
    const [searchTerm, setSearchTerm] = useState(""); //buscador
    const [products, setProducts] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Almacenar datos del producto seleccionado

    // Estados para la paginación
    const [page, setPage] = useState(0); // Página actual
    const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página

    // Manejar el cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Manejar el cambio en la cantidad de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Resetear a la primera página al cambiar el tamaño
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Obtener productos
    const getProducts = async () => {
        const res = await axios.get(URI);
        setProducts(res.data);
    };

    // Obtener producto por ID
    const getProductById = async (id) => {
        const res = await axios.get(`${URI_GET_PRODUCT}/${id}`);
        setSelectedProduct(res.data); // Guardar los datos del producto
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        await axios.delete(`${URI_DELETE}${id}`);
        getProducts();
    };

    // Abrir y cerrar el modal de creación
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    // Abrir y cerrar el modal de edición
    const handleOpenEdit = async (id) => {
        setSelectedProductId(id); // Guardar el ID del producto que se va a editar
        await getProductById(id); // Obtener los datos del producto
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedProductId(null);
        setSelectedProduct(null); // Limpiar los datos del producto seleccionado
    };

    // Filtrar productos según el término de búsqueda
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Productos paginados de acuerdo con la búsqueda y la paginación
    const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box width="100%" maxWidth="1300px" margin="0 auto" p={3} overflow="auto">
            <Box display="flex" justifyContent="flex-end" mb={2}>

                <TextField
                    label="Buscar producto"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el valor del input de búsqueda
                    sx={{ width: '40%' }} // Ajusta el tamaño del campo de búsqueda
                />


                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenCreate}
                    startIcon={<Icon>add</Icon>}
                >
                    Crear Producto
                </Button>
            </Box>

            {/* Modal de creación */}
            <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="crear-producto-modal">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        height: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '10px',
                        p: 4, overflowY: 'auto'
                    }}
                >
                    <CompCreateProduct handleClose={handleCloseCreate} refreshProducts={getProducts} />
                </Box>
            </Modal>

            {/* Modal de edición */}
            <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="editar-producto-modal">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 410,
                        height: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '10px',
                        p: 4,
                        overflowY: 'auto',
                    }}
                >
                    {selectedProduct && (
                        <CompEditProduct
                            handleClose={handleCloseEdit}
                            product={selectedProduct}
                            refreshProducts={getProducts}
                        />
                    )}
                </Box>
            </Modal>

            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Imagen</TableCell>
                        <TableCell align="center">Título</TableCell>
                        <TableCell align="center">Descripción</TableCell>
                        <TableCell align="center">Stock</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell align="center">
                                <img
                                    src={product.imagen}
                                    alt={product.title}
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </TableCell>
                            <TableCell align="center">{product.title}</TableCell>
                            <TableCell align="center">{product.descripcion}</TableCell>
                            <TableCell align="center">{product.cantidad}</TableCell>
                            <TableCell align="center">
                                <IconButton color="info" onClick={() => handleOpenEdit(product.id)}>
                                    <Icon>edit</Icon>
                                </IconButton>
                                <IconButton color="error" onClick={() => deleteProduct(product.id)}>
                                    <Icon>delete</Icon>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <ExportPDFButton
                        data={paginatedProducts}
                        columns={['Imagen', 'Titulo', 'Descripcion', 'Cantidad']}
                    />

                    {/* <ExportExcelButton
                                data={filteredOrdenes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                columns={['documento_beneficiario', 'nombre_beneficiario', 'entidad_profesional_remision', 'estado_orden', 'diagnostico_principal']}
                        /> */}
                </div>
                <TablePagination
                    page={page}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    count={filteredProducts.length}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    nextIconButtonProps={{ "aria-label": "Nueva Pagina" }}
                    backIconButtonProps={{ "aria-label": "Pagina Anterior" }}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </div>
        </Box>
    );
};

export default CompShowProducts;