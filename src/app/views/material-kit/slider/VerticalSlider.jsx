// import React from "react";
// import { Box } from "@mui/material";
// import { Slider, Typography } from "@mui/material";

// function valuetext(value) {
//   return `${value}°C`;
// }

// const marks = [
//   { value: 0, label: "0°C" },
//   { value: 20, label: "20°C" },
//   { value: 37, label: "37°C" },
//   { value: 100, label: "100°C" }
// ];

// export default function VerticalSlider() {
//   return (
//     <React.Fragment>
//       <Typography id="vertical-slider" gutterBottom>
//         Temperature
//       </Typography>
//       <Box height={300}>
//         <Slider
//           orientation="vertical"
//           getAriaValueText={valuetext}
//           defaultValue={30}
//           aria-labelledby="vertical-slider"
//         />
//         <Slider
//           disabled
//           orientation="vertical"
//           getAriaValueText={valuetext}
//           defaultValue={30}
//           aria-labelledby="vertical-slider"
//         />
//         <Slider
//           orientation="vertical"
//           defaultValue={[20, 37]}
//           aria-labelledby="vertical-slider"
//           getAriaValueText={valuetext}
//           marks={marks}
//         />
//       </Box>
//     </React.Fragment>
//   );
// }


import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button, 
    IconButton, 
    Paper, 
    Box, 
    Slider, 
    Typography 
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';





const URI = 'http://localhost:3001/api/productos/all';
const URI_DELETE = 'http://localhost:3001/api/productos/delete/';

const CompShowProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    // Mostrar productos
    const getProducts = async () => {
        const res = await axios.get(URI);
        setProducts(res.data);
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        await axios.delete(`${URI_DELETE}${id}`);
        getProducts();
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Button
                        component={Link}
                        to="/create"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Añadir Producto
                    </Button>

                    {/* Tabla de Productos */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Imagen</TableCell>
                                    <TableCell>Título</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img
                                                src={product.imagen}
                                                alt={product.title}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell>{product.title}</TableCell>
                                        <TableCell>{product.descripcion}</TableCell>
                                        <TableCell>{product.cantidad}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                component={Link}
                                                to={`/product/edit/${product.id}`}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => deleteProduct(product.id)}
                                                color="secondary"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    
                </div>
            </div>
        </div>
    );
};

export default CompShowProducts;
