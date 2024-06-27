import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../store/atoms/user.js";

function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const setUser = useSetRecoilState(userState);

    return <div>
            <div style={{
                paddingTop: 150,
                marginBottom: 10,
                display: "flex",
                justifyContent: "center"
            }}>
                <Typography variant={"h6"}>
                Welcome to KnowtBook. Sign up below
                </Typography>
            </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card varint={"outlined"} style={{width: 400, padding: 20}}>
                <TextField
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                    fullWidth={true}
                    label="Email"
                    variant="outlined"
                />
                <br/><br/>
                <TextField
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    fullWidth={true}
                    label="Password"
                    variant="outlined"
                    type={"password"}
                />
                <br/><br/>

                <Button
                    size={"large"}
                    variant="contained"
                    onClick={async() => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if(emailRegex.test(email)){

                            
                            try{
                                const response = await axios.post(`http://127.0.0.1:5000/register`, {
                                username: email,
                                password: password
                            })
                            let data = response.data;
                            if(data.access_token)
                            {
                                localStorage.setItem("token", data.access_token);
                                alert(data.message)
                                // window.location = "/"
                                setUser({userEmail: email, isLoading: false})
                                navigate("/")
                            }
                            }catch(error){
                                alert(error.response.data.message);
                                navigate("/login");

                            }
                            

                        }else{
                            alert("Please enter a valid email address!")
                        }}
                    }
                        
                > Signup</Button>
            </Card>
        </div>
    </div>
}

export default Signup;