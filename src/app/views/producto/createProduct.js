
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Grid, styled, Box } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Span } from 'app/components/Typography';
import { Icon } from '@mui/material';
import Swal from 'sweetalert2';
const URI = 'http://localhost:3001/api/productos/upload';

// Usando el estilo del template para TextField
const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px'
}));

const CompCreateProduct = ({ handleClose, refreshProducts }) => {
    const [imagen, setImagen] = useState(null);
    const [title, setTitle] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        // Generar una vista previa de la imagen
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // URL de la imagen
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null); // Si no hay imagen, no hay vista previa
        }
    };

    const store = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imagen);
        formData.append('title', title);
        formData.append('descripcion', descripcion);
        formData.append('cantidad', cantidad);

        try {
            await axios.post(URI, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Producto creado!',
                text: 'El producto se ha creado con éxito.',
            });

            handleClose();
            refreshProducts();
        } catch (error) {
            // Mostrar alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear el producto. Intenta nuevamente.',
            });

            console.error('Error al subir el producto:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ValidatorForm onSubmit={store} style={{ width: '100%', maxWidth: '500px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            type="file"
                            label="Imagen"
                            onChange={handleImageChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Mostrar la vista previa si hay una imagen seleccionada */}
                    {preview && (
                        <Grid item xs={12}>
                            <img
                                src={preview}
                                alt="Vista previa"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                            />
                        </Grid>
                    )}


                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            label="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            validators={['required']}
                            errorMessages={['Este campo es obligatorio']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            label="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            validators={['required']}
                            errorMessages={['Este campo es obligatorio']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            label="Stock"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
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

export default CompCreateProduct;
