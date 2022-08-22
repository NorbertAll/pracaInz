import React, { useContext } from 'react'
import { useEffect } from 'react'
import { Context } from '../helpers/Context'

const Test = () => {
    const {setVisi}=useContext(Context)
    useEffect(()=>{
        setVisi({status:false})
        
      }, [])
  return (
    <div>
      Działa
    </div>
  )
}

export default Test
