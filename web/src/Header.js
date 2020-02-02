import React, { useState } from 'react'

function Header(props){

    const [counter, setCounter] = useState(0)

    function incrementCounter(){
        setCounter(counter+1)
    }

    return (
        <>
            <h1> { props.title } </h1>
            <h1> Counter:{ counter }</h1>
            <button onClick={ incrementCounter }> Increment Counter </button>
        </>
    ) 
}

export default Header