import {Routes,Route,BrowserRouter} from 'react-router-dom'
import './index.css'
import { Home,About,SignIn,SignUp,Dashboard,Projects } from './pages';
import { Header } from './components';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Header/>}>
      <Route index element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/projects' element={<Projects/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
