import './App.css';
import { useForm } from 'react-hook-form'

function App() {

  const { register, handleSubmit ,watch, formState: { errors }} = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }
  
console.log(watch())
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>

      <input 
        type="text" 
        defaultValue="test" 
        {...register("name", 
          { required: 'This field is required', 
          maxLength:{value:4, message: "The max length is 4 characters"} 
        })} 
      />
      {errors.name && <span>{errors.name.message}</span>}


      <input type="number" {...register("lastname", { required: true, valueAsNumber:true })} />
      {errors.number?.type === 'required' && "number is required"}


      <select {...register("gender")}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select>

      <input {...register("Developer", { required: true })} type="radio" value="Yes" />
      <input {...register("check", { required: true })} type="checkbox" value="checkbox" />

      <input type="submit" />
    </form>
    </>
  );


}

export default App;


// const Input = ({ label, register, required }) => (
//   <>
//     <label>{label}</label>
//     <input {...register(label, { required })} />
//   </>
// );