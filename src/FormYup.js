import './App.css';
import {useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import axios from 'axios'

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { MenuItem } from '@mui/material';

const schema = yup.object().shape({
    name: yup.string().required("Nombre es requerido!"),
    email: yup.string().email("Debe ser un mail valido").required("Email es requerido"),
    number: yup.number().positive("Debe ser un nro positivo").required("Ingrese un numero").typeError('Debe ingresar un numero')
        .min(0, 'Min value 0.')
        .max(30, 'Max value 30.'),
    password: yup.string().min(4, "Contrasena de al menos 4 caracteres").max(15).required("Debe ingresar una contrasena"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], 'Las contrasenas deben ser iguales'),
    optionSelect: yup.string().required("Debe seleccionar una opcion"),
    infoSelect: yup.string().required("Debe seleccionar una opcion"),
})

const array = [
    { id: 1, desc: 'todos' },
]

function FormYup() {

    const [contentInffo, setContentInfo] = useState([])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data) => {
        console.log(data)
    }

    const handleChangeCiudadSel = async (e) => {
        const res = await axios.get(`https://jsonplaceholder.typicode.com/${e.target.value}`)
        setContentInfo(res.data)
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', height: '100%' }}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'start', height: '100%' }}>

                        <h1>YupForm</h1>
                        <InputLabel >Name:</InputLabel>
                        <TextField margin="normal" error={Boolean(errors.name)} helperText={errors.name?.message} variant="outlined" {...register("name")} type="text" placeholder="Name" />

                        <InputLabel>Mail:</InputLabel>
                        <TextField margin="dense" error={Boolean(errors.email)} helperText={errors.email?.message} variant="outlined" {...register("email")} type="text" placeholder="Email" />

                        <InputLabel>Number:</InputLabel>
                        <TextField margin="dense" error={Boolean(errors.number)} helperText={errors.number?.message} variant="outlined" {...register("number")} type="number" placeholder="Number" />

                        <InputLabel>Password:</InputLabel>
                        <TextField margin="dense" error={Boolean(errors.password)} helperText={errors.password?.message} variant="outlined" {...register("password")} type="password" placeholder="Password" />

                        <InputLabel>Confirm Password:</InputLabel>
                        <TextField margin="dense" error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message} variant="outlined" {...register("confirmPassword")} type="password" placeholder="Confirm Password" />

                        <TextField
                            select
                            label="CIUDAD"
                            name="optionSelect"
                            margin='dense'
                            fullWidth
                            {...register('optionSelect')}
                            onChange={handleChangeCiudadSel}
                            error={Boolean(errors.optionSelect)} helperText={errors.optionSelect?.message}
                            defaultValue=''
                        >
                            {array.map((option, i) => (
                                <MenuItem key={i} value={option.desc}>
                                    {option.desc}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Content Info."
                            name="infoSelect"
                            margin='dense'
                            fullWidth
                            {...register('infoSelect')}
                            error={Boolean(errors.infoSelect)} helperText={errors.infoSelect?.message}
                            disabled={contentInffo === '' ? true:false}
                            defaultValue=''
                        >
                            {contentInffo.map((option, i) => (
                                <MenuItem key={i} value={option.title}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button type="submit" fullWidth >Enviar</Button>
                    </div>

                </form>
            </div>
        </>
    );


}

export default FormYup;
