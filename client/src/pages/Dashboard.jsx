import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DashProfile, DashSidebar } from '../components';
import DashPosts from '../components/DashPosts';

export default function Dashboard() {
  const location = useLocation();
 
  const [tab,setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }

  },[location.search])
  return (
    <div className='w-full flex flex-col md:flex-row min-h-screen '>
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar/>
      </div>

      {/* profile */}
      {tab==='profile' &&   <DashProfile/>}

      {/* posts */}
      {tab==='posts' && <DashPosts/>}
    </div>
  )
}
