
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, styled, Box } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Span } from 'app/components/Typography';
import { Icon } from '@mui/material';
import Swal from 'sweetalert2';


const URI_EDIT = 'http://localhost:3001/api/productos/productos/';

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px'
}));

const CompEditProduct = ({ handleClose, refreshProducts, product }) => {
    const [imagen, setImagen] = useState('');
    const [newImagen, setNewImagen] = useState(null);
    const [title, setTitle] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');

    useEffect(() => {
        if (product) {
            setImagen(product.imagen);
            setTitle(product.title);
            setDescripcion(product.descripcion);
            setCantidad(product.cantidad);
        }
    }, [product]); 

    // Procedimiento para actualizar el producto
    const update = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (newImagen) {
            formData.append('image', newImagen);
        }
        formData.append('title', title);
        formData.append('descripcion', descripcion);
        formData.append('cantidad', cantidad);

        try {
            await axios.put(URI_EDIT + product.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Producto iditado!',
                text: 'El producto se ha editado con éxito.',
            });


            handleClose(); // Cerrar el modal
            refreshProducts(); // Refrescar la lista de productos
        } catch (error) {

            // Mostrar alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al editar el producto. Intenta nuevamente.',
            });


            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ValidatorForm onSubmit={update} style={{ width: '100%', maxWidth: '500px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <label className="form-label">Imagen actual</label>
                        {imagen && (
                            <div style={{ textAlign: 'center' }}>
                                <img src={imagen} alt="Imagen del producto" style={{ width: '200px', height: '200px' }} />
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <label className="form-label">Cambiar imagen</label>
                        <TextField
                            onChange={(e) => setNewImagen(e.target.files[0])}
                            type="file"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            label="Título"
                            validators={['required']}
                            errorMessages={['Este campo es obligatorio']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            type="text"
                            label="Descripción"
                            validators={['required']}
                            errorMessages={['Este campo es obligatorio']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            type="number"
                            label="Stock"
                            validators={['required']}
                            errorMessages={['Este campo es obligatorio']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="primary" variant="contained" type="submit" fullWidth>
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1 }}>Guardar</Span>
                        </Button>
                    </Grid>
                </Grid>
            </ValidatorForm>
        </Box>
    );
};

export default CompEditProduct;
