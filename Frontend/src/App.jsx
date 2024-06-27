import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Appbar from "./components/Appbar.jsx";
import {Home} from "./components/Home.jsx";
import Recommend from './components/Recommend.jsx';
import Search from './components/Search.jsx';
import {
  RecoilRoot,
  useSetRecoilState
} from 'recoil';
import axios from "axios";
import {useEffect} from "react";
import { userState } from "./store/atoms/user.js";
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import Landing from './components/Landing.jsx';
import { Bookmarks } from './components/Bookmarks.jsx';
import background from './components/boat-lake.jpg' ;



function App() {
  return (
    <RecoilRoot>
    <div style={{
      maxWidth : "100vw",
      minHeight:"100vh",
      backgroundImage: `url(${background})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
          
    }}>
                        <Router>
                            
                        <Appbar />
                        <InitUser/>
                        <Routes>
                        <Route path={"/home"} element={<Home />} />
                        <Route path={"/"} element={<Landing />} />
                        <Route path={"/register"} element={<Signup />} />
                        <Route path={"/login"} element={<Signin />} />
                        <Route path={"/:bookname"} element={<Recommend />} />
                        <Route path={"/books/:book"} element={<Search />} />
                        <Route path={"/bookmarks"} element={<Bookmarks />} />
                        
                        </Routes>
                    
                        </Router>
     </div>
    </RecoilRoot>


  )
}
function InitUser() {
  const setUser = useSetRecoilState(userState);
  const navigate=useNavigate();
  const init = async() => {
      try {
          const response = await axios.get(`http://127.0.0.1:5000/user/me`, {
              headers: {
                  "Authorization": localStorage.getItem("token"),
              }
          })

          if (response.data.username) {
              setUser({
                  isLoading: false,
                  userEmail: response.data.username
              })
          } else {
              setUser({
                  isLoading: false,
                  userEmail: null
              })
              
          }
      } catch (e) {
         console.log('hi');
         
         alert(e.response.data.message);
         setUser({
             isLoading: false,
             userEmail: null
            })
            
         // window.location='/'; to see error check your own whatsapp message on 9/3/24
         
        
         navigate('/login');
         

      }
  };

  useEffect(() => {
      init();
  }, []);

  return <></>
}


export default App
