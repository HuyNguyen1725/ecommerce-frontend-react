function FormErrors(props) {
    let errors = props.errors
    return (
        <div>
            {Object.keys(errors).map(key => 
                <li>{errors[key]}</li>
            )}
        </div>
    )
}
export default FormErrors