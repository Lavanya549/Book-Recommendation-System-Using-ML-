import {Typography,Box,AppBar,Toolbar} from "@mui/material";
import Button from "@mui/material/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { isUserLoading } from "../store/selectors/isUserLoading";
import {useSetRecoilState, useRecoilValue} from "recoil";
import { userState } from "../store/atoms/user.js";
import { userEmailState } from "../store/selectors/userEmail";
import { Loading } from "./Loading.jsx";
import Logo from "./logo.jpeg"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Tooltip from '@mui/material/Tooltip';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import axios from "axios";



function Appbar()
{
    const[search,setSearch]=useState("")
    const userLoading = useRecoilValue(isUserLoading);
    const userEmail = useRecoilValue(userEmailState);
    const setUser = useSetRecoilState(userState);

    const navigate = useNavigate()


    if (userLoading) {
        return <div>
            <Loading/>
        </div>
    }

    if (userEmail) {
        return <div>
            <Box>
                <AppBar position="fixed">
                    <Toolbar>
                    <div style={{marginLeft: 10, cursor: "pointer",flexGrow:1}} onClick={() => {navigate("/") }}>
                    <img src={Logo} alt="cant be viewed" width={150}height={50} />
                    
                    </div>
           <div style={{flexGrow:2,display:"flex",justifyContent:"center"}}> <TextField
                placeholder="Search Book title, author"
                type="search"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '25px',
                    marginRight: 10,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <div style={{marginTop:10}} ><Button
                color="inherit"
                onClick={() => {
                    if (search.length !== 0) {
                        window.location = "/books/" + search;
                    } else {
                        alert('Enter details correctly!');
                    }
                }}
            >
                Search
            </Button></div></div>
            
            <div style={{marginRight:10,cursor:"pointer"}} onClick={()=>{
                navigate('/bookmarks')
            }}>
            <Tooltip title='Favourites'><BookmarksIcon fontSize="large" /></Tooltip>
            </div>

                    <div style={{marginRight: 10}}>
                        <Button color="inherit"
                            onClick={() => {
                                navigate("/home")
                            }}
                        ><Tooltip title='Home'><HomeRoundedIcon fontSize="large"/></Tooltip></Button>
                    </div>

                    <div style={{marginRight: 10}}>
                        <Typography variant="subtitle1">{userEmail}</Typography>
                    </div>

                    <Button
                        color="inherit"
                        onClick={() => {
                            localStorage.setItem("token", null);
                            setUser({
                                isLoading: false,
                                userEmail: null
                            })
                            navigate('/')
                        }}
                    ><Tooltip title='Log Out'><LogoutRoundedIcon fontSize="large"/></Tooltip></Button>
                    </Toolbar>

                </AppBar>
            </Box>
            
        
</div>
} else {
    return <Box>
    <AppBar position="fixed">
        <Toolbar>
        <div style={{marginLeft: 10, cursor: "pointer",flexGrow:1}} onClick={() => {navigate("/") }}>
            <img src={Logo} alt="cant be viewed" width={150}height={50} />
        </div>
       
    
            <Button color="inherit"
                onClick={() => {
                    navigate("/login")
                }}
            >Signin</Button>
        

        <Button
            color="inherit"
            onClick={() => {
                navigate("/register")
            }}
        >Signup</Button>
        </Toolbar>

    </AppBar>
</Box>

    
}
}

export default Appbar;