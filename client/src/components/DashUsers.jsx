import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import * as request from "../service/axios";
import { Table,Modal,Button} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore]  = useState(true);
  const [showModal, setShowModal]  = useState(false);
  const [usersIdToDelete,setUsersIdToDelete] = useState('');

  useEffect(() => {
    const apiUsers = async () => {
      try {
        const res = await request.getUsers(
          `http://localhost:5000/api/user/getusers`,currentUser.token
        );
        if (res.success === true) {
          setUsers(res.users);
          if(res.users.length<9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      apiUsers();
    }
  }, [currentUser._id]);

  const handleShowMore= async()=>{
    const startIndex = users.length;
    const res = await request.getUsers(
      `http://localhost:5000/api/user/getusers?startIndex=${startIndex}`,currentUser.token
    );
    if(res.success){
      setUsers((prev)=>[...prev,...res.users]);
      if(res.users.length<9){
        setShowMore(false);
      }
    }
    try {
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUsers = async ()=>{
    setShowModal(false);
    try {
      const res = await request.deleteUser(`http://localhost:5000/api/user/delete-users/${usersIdToDelete}`,currentUser.token);
      if(res.success){
        setUsers((prev)=>prev.filter((user)=>user._id!==usersIdToDelete));
        setShowModal(false);
      }else{
        console.log(res);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className="table-auto overflow-x-scroll
     md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-300">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>User title </Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
    
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                
                  </Table.Cell>

                  <Table.Cell>
                  
                      {user.username}
                   
                  </Table.Cell>

                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin?(<FaCheck className="text-green-500"/>):(<FaTimes className="text-red-500"/>)}</Table.Cell>

                  <Table.Cell>
                    <span onClick={()=>{setShowModal(true);
                    setUsersIdToDelete(user._id)}} className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show more
              </button>
            )
          }
        </>
      ) : (
        <p>You have no users yet !</p>
      )}

<Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-gray-400
            dark:text-gray-200 mb-4 mx-auto"
            />
            <h3 className="mb-5 text-lg text--gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUsers}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashUsers;
