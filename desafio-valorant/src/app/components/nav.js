function Navbar({type, placeholder, onChange}){
    return(
        <div>
            <image src="https://i.pinimg.com/originals/c0/75/bf/c075bf9d6066fae5edd8079ac3ec0a8d.png"/>
            <ul>
                <li>Agentes</li>
                <li>Bundles</li>
                <li>Playercards</li>
            </ul>
            <input type={type} placeholder={placeholder} onChange={onChange}/>
        </div>
    )
}

export default Navbar;