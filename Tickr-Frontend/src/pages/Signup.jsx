import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
const Signup = () => {
  const [from, setForm]=useState({email:"",password:"",skills:[]})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setForm({...from, [e.target.name]: e.target.value})
  }
  const handleSignup= async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, 
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(from)

      })
      const data=await res.json()
      if(res.ok){
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/")
      }else{
        alert(data.message || "Signup failed")
      }
    } catch (error) {
      alert("An error occurred. Please try again.", error)
    }
    finally{
      setLoading(false)
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={from.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={from.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            className="input input-bordered"
            value={from.skills}
            onChange={handleChange}
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup