import {CircularProgress} from "@mui/material";

export const Loading = () => {
    return <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%", height: "100vh"}}>
        <div style={{display: "flex", justifyContent: "center"}}>
            <CircularProgress size={100}sx={{ color: 'orange' }}/>
        </div>
    </div>
}