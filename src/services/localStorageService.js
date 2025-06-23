export const SetLocalStorage=(key,value)=>{
   localStorage.setItem(key,value);
}

export const GetLocalStorage=(key)=>{
   const data=localStorage.getItem(key);
   // console.log(data);
   return data?JSON.parse(data):null
 }

 export const ClearLocalStorage=()=>{
    localStorage.clear('token');
    localStorage.clear('isLogin');
    return true
 }