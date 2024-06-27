import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../store/atoms/user.js";

function Signin() {
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
                Welcome to KnowtBook. Login below
                </Typography>
            </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card varint={"outlined"} style={{width: 400, padding: 20}}>
                <TextField
                    onChange={(evant11) => {
                        let elemt = evant11.target;
                        setEmail(elemt.value);
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
                    onClick={async () => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if(emailRegex.test(email)){

                        try{
                            const res = await axios.post(`http://127.0.0.1:5000/login`, {
                            username: email,
                            password: password
                        }, {
                            headers: {
                                "Content-type": "application/json"
                            }
                        });
                        const data = res.data;
                        if(data.access_token){
                            localStorage.setItem("token", data.access_token);
                            // window.location = "/"
                            setUser({
                                userEmail: email,
                                isLoading: false
                            })
                            alert(data.message);
                            navigate("/")
                        }
                        }catch(error){
                            alert(error.response.data.message)

                        }
                        
                    }else{
                        alert("Please enter a valid email address!");

                    }}
                }

                > Signin</Button>
            </Card>
        </div>
    </div>
}


export default Signin;