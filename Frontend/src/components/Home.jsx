import { useEffect, useState } from "react";
import {Typography,Card,Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import {Loading} from "./Loading.jsx";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail.js";
import AddToFavouritesModal from "./AddToFavouritesModal.jsx"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';



const addButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  cursor: 'pointer',

};
 function Home(){
    const [popular,setPopular]=useState(null)
    const userEmail=useRecoilValue(userEmailState)
    const [isModalOpen,setIsModalOpen]=useState(false)
    const [selectedBook, setSelectedBook] = useState({ title: '', author: '',image:'' });
    

     const handleAddToFavorites=async ()=>{
      try{
        const response = await axios.post('http://127.0.0.1:5000/favourites/add',{
        'book_title' : selectedBook.title,
        'book_author' : selectedBook.author,
        'book_image' : selectedBook.image 
      }, {
        headers: {
            Authorization: localStorage.getItem('token'),
            "Content-type": "application/json"
        }
    });
    setIsModalOpen(false);
    alert(response.data.message);

      }
      catch(error){
        setIsModalOpen(false);
        alert(error.response.data.message)
      }
    }
    const handleCardClick = (book) => {
      setSelectedBook({ title: book[0], author: book[1],image: book[2] });
      setIsModalOpen(true);
    };
    const init= async()=>{
    
        const response = await axios.get('http://127.0.0.1:5000/home', {
            headers: {
                Authorization: localStorage.getItem('token'),
                "Content-type": "application/json"
            }
        });
        if(response.data.item)
        {
          setPopular(response.data.item)
        }else{
          alert(response.data.message)
        }
    
    }
    useEffect(()=>{
        init();
    },[]);

    return  popular&&userEmail  ? <div>
    <div style={{paddingTop:100,marginLeft:50,textAlign:'center'}}><h1>Top 50 Books</h1></div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",marginTop:40}}>
      {popular.map((book, index) => (
        <div key={index}>
            <Card style={{
              margin: 10,
              width: 150,
              padding:20,
              height: 265, // Set a fixed height
              display: "flex",
              marginRight:25,
              marginLeft:25,
              position:"relative",
              //border:"2px solid black",
              flexDirection: "column",
              overflow:"hidden",
              transition:'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale on hover
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset on mouse out

            > 
            <Tooltip title={"Add to favourites"} >
            
             <div style={addButtonStyle} onClick={()=>handleCardClick(book)}><BookmarkAddIcon/></div> 
              </Tooltip>

              <div style={{ flex: 1, overflow: "hidden" }}>
                <Tooltip title={`${book[3].toString().substring(0,3)}⭐`} arrow placement="top">
                 <center>              
                    <img src={book[2]}  alt={`Book cover for ${book[2]}`} />
</center>
                </Tooltip>
                <Typography style={{ marginBottom: 5,fontWeight:"bold" ,overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}title={book[0]}  variant="subtitle1">
                  {book[0]}
                </Typography>
                <Typography style={{color:'#555',overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}title={book[1]}   variant="subtle1">{book[1]}</Typography>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Button variant="contained" size="medium" style={{ backgroundColor: "#9575cd", color: "#fff", borderRadius: "0 0 10px 10px" }} onClick={() => { window.location = "/" + book[0] }}>Recommend</Button>
              </div>
            </Card>
        </div>
      ))}
    </div>
    <AddToFavouritesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddToFavorites}
      />
  </div>
  :
   <Loading/> 
    

}
export {Home,addButtonStyle};


