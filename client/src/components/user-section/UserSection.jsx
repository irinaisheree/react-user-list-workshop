import { useEffect, useState } from "react";
import Search from "../search/Search";
import Pagination from "./pagination/Pagination";
import UserList from "./user-list/UserList";
import UserAdd from "./user-add/UserAdd";
import UserDetails from "./user-details/UserDetails";

const baseUrl = 'http://localhost:3030/jsonstore'


export default function UserSection() {

  const [users, setUsers] = useState([])
  const[showAddUser, setShowAddUser] = useState(false)
  const [showUserDetailsById, setshowUserDetailsById] = useState(null)

  useEffect(()=> {
    (async function getUsers(){
      try { 
        const response = await fetch(`${baseUrl}/users`)
      const result = await response.json()
      const userResult = Object.values(result)

      setUsers(userResult)
      console.log(users)
        
      } catch (error) {
        alert(error.message)
      }


    })()

  }, [])


  const addUserClickHandler = () => {
    setShowAddUser(true)

  }

  const addUserCloseHandler = () => {
    setShowAddUser(false)
  }


  const addUserSaveHandler = async (e) => {
    e.preventDefault()

    //get user data
    const formData = new FormData(e.currentTarget)
    const userData = {
      ...Object.fromEntries(formData),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }


    //make post request

    const response = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    const createdUser = await response.json()
    console.log(createdUser)


    //update local state

    setUsers(oldUsers => [...oldUsers, createdUser])

    //close modal

    setShowAddUser(false)
  }

const userDetailsClickHandler = (userId) => {
  setshowUserDetailsById(userId)

}

    return (
            <section className="card users-container">
      <Search/>

      <UserList users={users}
      onUserDetailsClick={userDetailsClickHandler}
      />

    {showAddUser && <UserAdd 
    onClose={addUserCloseHandler}
    onSave={addUserSaveHandler}
    /> }

   
    {showUserDetailsById && (
       <UserDetails user={users.find(user => user._id === showUserDetailsById)}/>
       )}

      {/* <!-- New user button  --> */}
      <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

     <Pagination/>
    </section>
    );
}