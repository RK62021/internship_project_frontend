import { legacy_createStore as createStore } from 'redux'

const userData=JSON.parse(localStorage.getItem('user'));
console.log("userData------------",userData);
// const userRole=userData[0]?.role;
console.log("userTpr------------",userData);

const initialState = {
  sidebarShow: true,
  theme: 'Dark',
  userType:userData?userData[0].userType : '',
  userName:userData?userData[0].username :'',
  userId:userData?userData[0].userId :'',
}
console.log("initialState------------",initialState);

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
