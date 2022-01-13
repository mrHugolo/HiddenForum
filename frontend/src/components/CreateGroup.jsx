import { useState } from "react"
import { Fetch } from "../utils/fetch"
import css from "../styles/index.module.css"

export const CreateGroup = ({groups}) => {
  const [isHidden, setIsHidden] = useState(true)

  const handleClick = async () => {
    if(isHidden) {
      setIsHidden(false)
      return
    }
    let name = document.getElementById("createGroup-groupName")
    let desc = document.getElementById("createGroup-groupDesc")
  
    const obj = {
      name: name?.value,
      description: desc?.value
    }
    let res = await Fetch("rest/group", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(obj),
    })
    if(!res.response){
      name.value = "Name already taken"
      return
    }
    let arr = groups.groups.slice()
    arr.push(obj)
    groups.setGroups(arr)
    name.value = ""
    desc.value = ""
    setIsHidden(true)
  }

  return(
    <div>
      <div className={isHidden ? css.hide : ``}>
        <input id="createGroup-groupName" placeholder="Group Name" />
        <input id="createGroup-groupDesc" placeholder="Group Description" />
      </div>
      <button onClick={() => handleClick()}>
        + Create Group
      </button>
    </div>
  )
}