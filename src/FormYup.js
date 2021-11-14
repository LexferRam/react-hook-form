import './App.css';
import { useState } from 'react'
import { useForm } from 'react-hook-form'
// import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/pt-br';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, Radio, RadioGroup } from '@mui/material';

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
    acceptTerms: yup.bool().oneOf([true], 'Accept Ts & Cs is required'),
    radioOptions: yup.string().required('Favor responder el quiz').nullable(),
    dateSelected: yup.date().required("Ingrese una fecha"),
    dateSelected2: yup.date().min(
        yup.ref('dateSelected'),
        "Fecha de culminacion debe ser mayor a la de inicio"
      )
})


function FormYup() {

    const [contentInffo, setContentInfo] = useState([])
    const [array, setArray] = useState([{ id: 1, desc: 'todos' }])

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data) => {
        data.dateSelected = moment(data.dateSelected).format("DD/MM/YYYY");
        data.dateSelected2 = moment(data.dateSelected2).format("DD/MM/YYYY");
        console.log(data)
        reset();
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

                        {/* SELECT LIST */}
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
                            margin='dense'
                            fullWidth
                            {...register('infoSelect')}
                            error={Boolean(errors.infoSelect)} 
                            helperText={errors.infoSelect?.message}
                            disabled={contentInffo.toString() === '' ? true : false}
                            defaultValue=''
                        >
                            {contentInffo.map((option, i) => (
                                <MenuItem key={i} value={option.title}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* CHECKBOX */}
                        <FormControl
                            required
                            error={Boolean(errors.acceptTerms)}
                            component="fieldset"
                            sx={{ m: 3 }}
                            variant="standard"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox {...register("acceptTerms")}  />
                                }
                                label="Terminos y condiciones"
                            />
                            <FormHelperText>{errors.acceptTerms?.message}</FormHelperText>
                        </FormControl>

                        {/* RADIO Button */}
                        <FormControl
                            sx={{ m: 3 }}
                            component="fieldset"
                            error={Boolean(errors.radioOptions)}
                            variant="standard"
                        >
                            <FormLabel component="legend">Pop quiz: MUI is...</FormLabel>
                            <RadioGroup
                                aria-label="quiz"
                            >
                                <FormControlLabel value="best" control={<Radio defaultValue=''  {...register("radioOptions")} />} label="The best!" />
                                <FormControlLabel value="worst" control={<Radio defaultValue='' {...register("radioOptions")} />} label="The worst." />
                            </RadioGroup>
                            <FormHelperText>{errors.radioOptions?.message}</FormHelperText>
                        </FormControl>


                        {/* DATE */}
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Date desktop"
                                inputFormat="MM/dd/yyyy"
                                // value={value}
                                renderInput={(params) => <TextField {...params} />}
                                {...register("dateSelected")}
                            />
                        </LocalizationProvider> */}
                        <TextField
                            margin="normal"
                            id="date"
                            label="Birthday"
                            {...register("dateSelected") }
                            type="date"
                            defaultValue={moment().format("YYYY-MM-DD")}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={Boolean(errors.dateSelected)}
                            helperText={errors.dateSelected?.message}
                        />

                        <TextField
                            margin="normal"
                            id="date2"
                            label="Birthday2"
                            {...register("dateSelected2")}
                            type="date"
                            defaultValue={moment().format("YYYY-MM-DD")}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={Boolean(errors.dateSelected2)}
                            helperText={errors.dateSelected2?.message}
                        />

                        <Button type="submit" fullWidth >Enviar</Button>
                    </div>

                </form>
            </div>
        </>
    );


}

export default FormYup;
