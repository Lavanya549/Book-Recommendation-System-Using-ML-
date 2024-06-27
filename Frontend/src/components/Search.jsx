import { useEffect, useState } from "react";
import { Paper, Typography,Card,Button, Hidden } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loading } from "./Loading.jsx";
import Tooltip from '@mui/material/Tooltip';
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail.js";
import AddToFavouritesModal from "./AddToFavouritesModal.jsx"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { addButtonStyle } from "./Home.jsx";



function Search(){
    let { book } = useParams();
    const userEmail=useRecoilValue(userEmailState)
    const[searchResults,setSearchResults]=useState(null);
    const [isModalOpen,setIsModalOpen]=useState(false)
    const [selectedBook, setSelectedBook] = useState({ title: '', author: '',image:'' });
    useEffect(()=>{
        axios.get(`http://127.0.0.1:5000/books?search=${book}`,{
          headers:{
            'Authorization':localStorage.getItem('token')
          }
        }).then(res => {
        setSearchResults(res.data);
    })
    .catch(e => {
        return <div>
            <h1>Error</h1>
        </div>
    })
    },[])

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
      setSelectedBook({ title: book.title, author: book.author,image: book.image_url });
      setIsModalOpen(true);
    };
    
    return searchResults && userEmail ? <div>
    <div style={{paddingTop:100,marginLeft:50}}><h1>Search Results for "{book}" are:</h1></div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",marginTop:40 }}>
      {searchResults.map((book, index) => (
        <div key={index}>
            <Card style={{
              margin: 10,
              width: 200,
              padding:20,
              height: 410, // Set a fixed height
              display: "flex",
              marginRight:50,
              position:"relative",
              border:"1px solid black",
              flexDirection: "column",
              overflow:"hidden",
              transition:'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale on hover
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset on mouse out

            >
                <div style={{ flex: 1, overflow: "hidden" }}>
                <Tooltip title={`${book.avg_rating.toString().substring(0,3)}⭐`} arrow placement="top">
                <img src={book.image_url} width={200} height={300} alt={`Book cover for ${book.image_url}`} />
                </Tooltip>
                <Typography style={{ marginBottom: 5,fontWeight:"bold" ,overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}title={book.title}  variant="subtitle1">
                  {book.title}
                </Typography>
                <Typography style={{color:'#555',overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}title={book.author}   variant="subtle1">{book.author}</Typography>
              </div>
              <div style={{ marginTop: "auto" ,display:"flex",justifyContent:"space-between"}}>
                <Button variant="contained" size="large" style={{ backgroundColor: "#9575cd", color: "#fff", borderRadius: "0 0 10px 10px" }} onClick={() => { window.location = "/" + book.title }}>Recommend</Button>
                <Tooltip title={"Add to favourites"} >
            
            <div style={{cursor:"pointer"}}  onClick={()=>handleCardClick(book)}><BookmarkAddIcon fontSize="large"/></div> 
             </Tooltip>
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
  </div>: <Loading/>


}
export default Search;