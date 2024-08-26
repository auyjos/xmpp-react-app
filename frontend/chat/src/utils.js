
//"usertest123@alumchat.lol/gajim.FVZNYWDQ"
export const extractUser = (userString='') => {
    return userString.split('/')[0];
}